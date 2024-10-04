const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('checkRole middleware ejecutándose');
    console.log('Roles permitidos:', roles);
    console.log('Rol del usuario:', req.user.role);
    if (!req.user) {
      console.log('No hay usuario autenticado');
      return res.status(401).json({ message: 'No autenticado' });
    }
    if (!roles.includes(req.user.role)) {
      console.log('Usuario no tiene el rol requerido');
      return res.status(403).json({ message: 'No autorizado' });
    }
    console.log('Usuario autorizado');
    next();
  };
};

module.exports = checkRole;