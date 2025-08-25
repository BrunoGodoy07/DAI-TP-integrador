export const theme = {
  colors: {
    // Colores principales
    primary: '#6B46C1', // Morado principal
    primaryDark: '#553C9A', // Morado oscuro
    primaryLight: '#9F7AEA', // Morado claro
    
    // Colores secundarios
    secondary: '#805AD5', // Morado secundario
    secondaryDark: '#6B46C1', // Morado secundario oscuro
    secondaryLight: '#B794F4', // Morado secundario claro
    
    // Colores de fondo
    background: '#1A202C', // Fondo principal oscuro
    surface: '#2D3748', // Superficie oscura
    surfaceLight: '#4A5568', // Superficie más clara
    
    // Colores de texto
    text: '#F7FAFC', // Texto principal claro
    textSecondary: '#E2E8F0', // Texto secundario
    textMuted: '#A0AEC0', // Texto atenuado
    
    // Colores de estado
    success: '#48BB78', // Verde
    warning: '#ED8936', // Naranja
    error: '#F56565', // Rojo
    info: '#4299E1', // Azul
    
    // Colores de borde
    border: '#4A5568', // Borde principal
    borderLight: '#718096', // Borde claro
    
    // Colores de sombra
    shadow: 'rgba(0, 0, 0, 0.3)', // Sombra
  },
  
  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Bordes redondeados
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Sombras
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  
  // Tipografía
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#F7FAFC',
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#F7FAFC',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      color: '#F7FAFC',
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      color: '#F7FAFC',
    },
    body: {
      fontSize: 16,
      color: '#F7FAFC',
    },
    caption: {
      fontSize: 14,
      color: '#A0AEC0',
    },
  },
};

export default theme;
