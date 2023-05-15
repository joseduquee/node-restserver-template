export const isAdmin = (req, resp, next) => {
  if (!req.user) {
    return resp.status(500).json({
      msg: "Check role without token",
    });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return resp.status(401).json({
      msg: `${name} is not admin`,
    });
  }

  next();
};

export const hasRole = (...roles) => {
  return (req, resp, next) => {
    
    if (!req.user) {
      return resp.status(500).json({
        msg: "Check role without token",
      });
    }

    if(!roles.includes(req.user.role)){
        return resp.status(401).json({
            msg: `Service require one of those roles ${ roles }`
        })
    }
    next();
  };
};
