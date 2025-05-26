const request = require('supertest');
const express = require('express');
const cveRoutes = require('./cve.route'); // Adjust path as necessary
const cveController = require('../controllers/cve.controller');

// Mock the controller methods that the routes use
jest.mock('../controllers/cve.controller', () => ({
  // Mock all methods used by cve.route.js
  listarCVEsExploitDB: jest.fn((req, res) => res.status(200).json({ message: 'ExploitDB CVEs listed' })),
  getDbCves: jest.fn((req, res) => res.status(200).json(['CVE-2023-0001'])),
  analisarCVE: jest.fn((req, res) => res.status(200).json({ cve: req.params.numeroCVE, status: 'analisado' })),
  obterExplicacaoJSON: jest.fn((req, res) => res.status(200).json({ cve: req.params.numeroCVE, explicacao: 'detalhes' })),
  getCveInformacoesJson: jest.fn((req, res) => res.status(200).json({ cve: req.params.cveId, info: 'info.json' })),
  getCveDockerCompose: jest.fn((req, res) => res.status(200).type('text/yaml').send('docker-compose content')),
  getCveExplicacaoHtml: jest.fn((req, res) => res.status(200).type('text/html').send('<h1>explicação</h1>')),
  registrarCVE: jest.fn((req, res) => res.status(201).json({ cve: req.params.cveId, message: 'registrado' })),
}));

const app = express();
app.use(express.json()); // To parse JSON request bodies, if any route needs it
app.use('/api/cve', cveRoutes); // Mount the routes under /api/cve for testing

describe('CVE API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('GET /api/cve/exploitdb should call listarCVEsExploitDB', async () => {
    const response = await request(app).get('/api/cve/exploitdb');
    expect(response.statusCode).toBe(200);
    expect(cveController.listarCVEsExploitDB).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe('ExploitDB CVEs listed');
  });

  it('GET /api/cve/db should call getDbCves', async () => {
    const response = await request(app).get('/api/cve/db');
    expect(response.statusCode).toBe(200);
    expect(cveController.getDbCves).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(['CVE-2023-0001']);
  });

  it('GET /api/cve/analisar/:numeroCVE should call analisarCVE', async () => {
    const cve = 'CVE-2023-1111';
    const response = await request(app).get(`/api/cve/analisar/${cve}`);
    expect(response.statusCode).toBe(200);
    expect(cveController.analisarCVE).toHaveBeenCalledTimes(1);
    expect(cveController.analisarCVE.mock.calls[0][0].params.numeroCVE).toBe(cve);
    expect(response.body.status).toBe('analisado');
  });
  
  it('GET /api/cve/explicar/:numeroCVE/json should call obterExplicacaoJSON', async () => {
    const cve = 'CVE-2023-2222';
    const response = await request(app).get(`/api/cve/explicar/${cve}/json`);
    expect(response.statusCode).toBe(200);
    expect(cveController.obterExplicacaoJSON).toHaveBeenCalledTimes(1);
    expect(response.body.explicacao).toBe('detalhes');
  });

  it('GET /api/cve/:cveId/informacoes should call getCveInformacoesJson', async () => {
    const cve = 'CVE-2023-3333';
    const response = await request(app).get(`/api/cve/${cve}/informacoes`);
    expect(response.statusCode).toBe(200);
    expect(cveController.getCveInformacoesJson).toHaveBeenCalledTimes(1);
    expect(response.body.info).toBe('info.json');
  });

  it('GET /api/cve/:cveId/docker-compose should call getCveDockerCompose', async () => {
    const cve = 'CVE-2023-4444';
    const response = await request(app).get(`/api/cve/${cve}/docker-compose`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/yaml/);
    expect(cveController.getCveDockerCompose).toHaveBeenCalledTimes(1);
    expect(response.text).toBe('docker-compose content');
  });

  it('GET /api/cve/:cveId/explicacao-html should call getCveExplicacaoHtml', async () => {
    const cve = 'CVE-2023-5555';
    const response = await request(app).get(`/api/cve/${cve}/explicacao-html`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(cveController.getCveExplicacaoHtml).toHaveBeenCalledTimes(1);
    expect(response.text).toBe('<h1>explicação</h1>');
  });
  
  it('POST /api/cve/registrar/:cveId should call registrarCVE', async () => {
    const cve = 'CVE-2023-6666';
    const response = await request(app).post(`/api/cve/registrar/${cve}`);
    // Check if the controller was called correctly
    expect(cveController.registrarCVE).toHaveBeenCalledTimes(1);
    expect(cveController.registrarCVE.mock.calls[0][0].params.cveId).toBe(cve);
    // Check the response
    expect(response.statusCode).toBe(201); // Assuming 201 for successful registration
    expect(response.body.message).toBe('registrado');
  });
});
