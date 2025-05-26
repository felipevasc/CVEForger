const cveController = require('./cve.controller');
const fsPromises = require('fs').promises;
const fs = require('fs'); // For non-promise readFile used in some functions
const cveAnaliseServico = require('../../services/cve-analise.service');
const cveExplicacaoServico = require('../../services/cve-explicacao.service');
const path = require('path');

// Mock dependencies
jest.mock('fs');
jest.mock('fs', () => ({
    ...jest.requireActual('fs'), // import and retain default behavior
    promises: {
        readdir: jest.fn(),
        // readFile: jest.fn(), // If all readFile were promises
    },
    readFile: jest.fn(), // For those using fs.readFile directly
}));
jest.mock('../../services/cve-analise.service');
jest.mock('../../services/cve-explicacao.service');

const OUTPUT_DIR_RELATIVE = '../../../../output'; // Relative path used in controller

describe('CVE Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('getDbCves', () => {
    it('should return a list of CVE IDs from directory names', async () => {
      const mockDirents = [
        { name: 'CVE-2023-0001', isDirectory: () => true },
        { name: 'CVE-2023-0002', isDirectory: () => true },
        { name: 'not-a-cve', isDirectory: () => true },
        { name: 'CVE-2023-0003.txt', isDirectory: () => false },
        { name: 'cve-2023-0004', isDirectory: () => true }, // Lowercase test
      ];
      fsPromises.readdir.mockResolvedValue(mockDirents);

      await cveController.getDbCves(mockReq, mockRes, mockNext);

      expect(fsPromises.readdir).toHaveBeenCalledWith(expect.stringContaining(path.normalize('output')), { withFileTypes: true });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(['CVE-2023-0001', 'CVE-2023-0002', 'CVE-2023-0004']);
    });

    it('should handle ENOENT error and return 404 if output directory not found', async () => {
      const error = new Error('Directory not found');
      error.code = 'ENOENT';
      fsPromises.readdir.mockRejectedValue(error);

      await cveController.getDbCves(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Output directory not found.', cves: [] });
    });
    
    it('should call next with error for other errors', async () => {
        const error = new Error('Some other error');
        fsPromises.readdir.mockRejectedValue(error);
        await cveController.getDbCves(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('registrarCVE', () => {
    beforeEach(() => {
        cveAnaliseServico.analisarCVECompleta.mockResolvedValue({ status: 'analysis complete' });
        cveExplicacaoServico.gerarExplicacaoCompleta.mockResolvedValue({ status: 'explanation complete' });
    });

    it('should call analysis and explanation services and return 200 on success', async () => {
      mockReq.params.cveId = 'CVE-2023-1234';
      await cveController.registrarCVE(mockReq, mockRes, mockNext);

      expect(cveAnaliseServico.analisarCVECompleta).toHaveBeenCalledWith('CVE-2023-1234');
      expect(cveExplicacaoServico.gerarExplicacaoCompleta).toHaveBeenCalledWith('CVE-2023-1234');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        mensagem: 'CVE CVE-2023-1234 registrada e processada com sucesso.',
      }));
    });

    it('should return 400 for invalid CVE ID format', async () => {
      mockReq.params.cveId = 'INVALID-CVE';
      await cveController.registrarCVE(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: expect.any(String) });
    });
    
    it('should call next with error if a service fails', async () => {
        mockReq.params.cveId = 'CVE-2023-1234';
        const serviceError = new Error('Service failure');
        cveAnaliseServico.analisarCVECompleta.mockRejectedValue(serviceError);
        await cveController.registrarCVE(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  describe('getCveInformacoesJson', () => {
    it('should return JSON data on successful file read', async () => {
      mockReq.params.cveId = 'CVE-2023-0001';
      const mockData = { key: 'value' };
      fs.readFile.mockImplementation((path, encoding, callback) => {
        callback(null, JSON.stringify(mockData));
      });

      await cveController.getCveInformacoesJson(mockReq, mockRes, mockNext);
      
      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining(path.join('output', 'CVE-2023-0001', 'informacoes.json')),
        'utf8',
        expect.any(Function)
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it('should return 404 if informacoes.json not found', async () => {
      mockReq.params.cveId = 'CVE-2023-0001';
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockImplementation((path, encoding, callback) => {
        callback(error);
      });

      await cveController.getCveInformacoesJson(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ erro: 'Arquivo informacoes.json não encontrado para este CVE.' });
    });
    
    it('should call next with error for other readFile errors', async () => {
        mockReq.params.cveId = 'CVE-2023-0001';
        const error = new Error('Read error');
        fs.readFile.mockImplementation((path, encoding, callback) => callback(error));
        await cveController.getCveInformacoesJson(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should return 400 for invalid CVE ID format', async () => {
        mockReq.params.cveId = 'INVALID';
        await cveController.getCveInformacoesJson(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ erro: expect.any(String) });
    });
  });

  describe('getCveDockerCompose', () => {
    it('should return YAML data and correct headers on success', async () => {
        mockReq.params.cveId = 'CVE-2023-0001';
        const mockYamlData = "version: '3.8'";
        fs.readFile.mockImplementation((path, enc, callback) => callback(null, mockYamlData));
        
        await cveController.getCveDockerCompose(mockReq, mockRes, mockNext);
        
        expect(fs.readFile).toHaveBeenCalledWith(
            expect.stringContaining(path.join('output', 'CVE-2023-0001', 'docker-compose.yml')),
            'utf8',
            expect.any(Function)
        );
        expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/yaml');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith(mockYamlData);
    });
    // Add tests for 404, other errors, and invalid CVE ID similar to getCveInformacoesJson
  });

  describe('getCveExplicacaoHtml', () => {
    it('should return HTML data and correct headers on success', async () => {
        mockReq.params.cveId = 'CVE-2023-0001';
        const mockHtmlData = "<h1>Hello</h1>";
        fs.readFile.mockImplementation((path, enc, callback) => callback(null, mockHtmlData));

        await cveController.getCveExplicacaoHtml(mockReq, mockRes, mockNext);

        expect(fs.readFile).toHaveBeenCalledWith(
            expect.stringContaining(path.join('output', 'explicacoes', 'CVE-2023-0001', 'explicacao-cve-2023-0001.html')),
            'utf8',
            expect.any(Function)
        );
        expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith(mockHtmlData);
    });
    // Add tests for 404, other errors, and invalid CVE ID similar to getCveInformacoesJson
  });
});
