const Users = require('../models/userModel');

// Define role permissions
const ROLE_PERMISSIONS = {
    viewer: [
        'view_products',
        'view_analytics',
        'view_dashboard'
    ],
    manager: [
        'view_products',
        'create_products',
        'update_products',
        'delete_products',
        'view_orders',
        'update_orders',
        'view_categories',
        'create_categories',
        'update_categories',
        'delete_categories'
    ],
    admin: [
        'view_products',
        'create_products', 
        'update_products',
        'delete_products',
        'view_orders',
        'update_orders',
        'delete_orders',
        'view_categories',
        'create_categories',
        'update_categories', 
        'delete_categories',
        'view_users',
        'create_users',
        'update_users',
        'delete_users',
        'view_analytics',
        'manage_roles',
        'system_settings'
    ]
};

// Middleware to check if user has required permission
const hasPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            const userPermissions = ROLE_PERMISSIONS[user.role] || [];
            
            if (userPermissions.includes(requiredPermission)) {
                next();
            } else {
                return res.status(403).json({ 
                    msg: `Access denied. Required permission: ${requiredPermission}. Your role: ${user.role}` 
                });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    };
};

// Middleware to check if user has specific role
const hasRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            if (user.role === requiredRole || user.role === 'admin') {
                next();
            } else {
                return res.status(403).json({ 
                    msg: `Access denied. Required role: ${requiredRole}. Your role: ${user.role}` 
                });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    };
};

// Get user's permissions
const getUserPermissions = async (userId) => {
    try {
        const user = await Users.findById(userId);
        return ROLE_PERMISSIONS[user.role] || [];
    } catch (err) {
        return [];
    }
};

module.exports = {
    hasPermission,
    hasRole,
    getUserPermissions,
    ROLE_PERMISSIONS
};
