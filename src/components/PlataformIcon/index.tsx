import React from 'react';
import { Box, Typography } from '@mui/material';
// Importando ícones de diversas bibliotecas para maior cobertura de plataformas
import {
  FaWindows,
  FaAndroid,
  FaApple,
  FaLinux,
  FaSolarPanel,
  FaReact,
} from 'react-icons/fa';
import {
  DiJavascript1,
  DiJava,
  DiPython,
  DiRuby,
  DiPhp,
  DiGo,
} from 'react-icons/di';
import {
  SiTypescript,
  SiKotlin,
  SiRust,
  SiNodedotjs as SiNodeDotJs,
  SiDocker,
  SiSqlite,
} from 'react-icons/si';
import { GoBrowser, GoServer } from 'react-icons/go';

interface PlatformIconProps {
  platform: string;
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 40,
}) => {
  const key = platform?.toLowerCase() ?? '';

  const iconsMap: Record<string, React.ReactNode> = {
    windows: <FaWindows size={size} />,
    windows_x86: <FaWindows size={size} />,
    windows_x86_64: <FaWindows size={size} />,
    android: <FaAndroid size={size} />,
    ios: <FaApple size={size} />,
    macos: <FaApple size={size} />,
    osx: <FaApple size={size} />,
    watchos: <FaApple size={size} />,
    linux: <FaLinux size={size} />,
    solaris: <FaSolarPanel size={size} />,
    aix: <GoServer size={size} />,
    bsd: <GoServer size={size} />,
    freebsd: <GoServer size={size} />,
    netbsd: <GoServer size={size} />,
    openbsd: <GoServer size={size} />,
    minix: <GoServer size={size} />,
    irix: <GoServer size={size} />,
    tru64: <GoServer size={size} />,
    ultrix: <GoServer size={size} />,
    nodejs: <SiNodeDotJs size={size} />,
    javascript: <DiJavascript1 size={size} />,
    typescript: <SiTypescript size={size} />,
    java: <DiJava size={size} />,
    python: <DiPython size={size} />,
    python2: <DiPython size={size} />,
    python3: <DiPython size={size} />,
    ruby: <DiRuby size={size} />,
    php: <DiPhp size={size} />,
    go: <DiGo size={size} />,
    rust: <SiRust size={size} />,
    kotlin: <SiKotlin size={size} />,
    docker: <SiDocker size={size} />,
    c: <SiSqlite size={size} />,
    asp: <GoBrowser size={size} />,
    aspx: <GoBrowser size={size} />,
    cfm: <GoBrowser size={size} />,
    cgi: <GoBrowser size={size} />,
    jsp: <GoBrowser size={size} />,
    json: <GoBrowser size={size} />,
    xml: <GoBrowser size={size} />,
    arm: <FaAndroid size={size} />,
    hardware: <SiDocker size={size} />,
    default: <FaReact size={size} />,
  };

  // Seleção base: corresponde ao início da string ou igualdade exata
  const iconKey = Object.keys(iconsMap).find(
    (k) => key === k || key.startsWith(k)
  );
  const icon = iconKey ? iconsMap[iconKey] : iconsMap['default'];

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      {icon}
      <Typography variant='caption' sx={{ textTransform: 'none' }}>
        {platform}
      </Typography>
    </Box>
  );
};
