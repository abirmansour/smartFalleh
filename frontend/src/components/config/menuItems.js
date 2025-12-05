import React from 'react';
import { 
  FiGrid, 
  FiUser, 
  FiFileText, 
  FiHome, 
  FiSettings, 
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiClipboard,
  FiMail,
  FiPackage, 
  FiLayers
} from 'react-icons/fi';
import { UserRole } from '../../constants/roles';

const createIcon = (Icon) => React.createElement(Icon);

// Admin menu items
export const adminMenuItems = [
  {
    title: 'Dashboard',
    path: '',
    icon: createIcon(FiGrid),
    allowedRoles: [UserRole.ADMIN]
  },
  {
    title: 'Administration',
    path: 'administration',
    icon: createIcon(FiSettings),
    allowedRoles: [UserRole.ADMIN],
    children: [
      {
        title: 'Agriculteur',
        path: 'administration/agriculteur',
        icon: createIcon(FiUsers),
        allowedRoles: [UserRole.ADMIN]
      },
      {
        title: 'Jury',
        path: 'administration/jury',
        icon: createIcon(FiUsers),
        allowedRoles: [UserRole.ADMIN]
      },
      {
        title: 'Responsable',
        path: 'administration/responsable',
        icon: createIcon(FiUsers),
        allowedRoles: [UserRole.ADMIN]
      },
      {
        title: 'Demande',
        path: 'administration/demande',
        icon: createIcon(FiFileText),
        allowedRoles: [UserRole.ADMIN]
      },
      {
        title: 'Product',
        path: 'administration/product',
        icon: createIcon(FiPackage),
        allowedRoles: [UserRole.ADMIN]
      },
      {
        title: 'Cooperative',
        path: 'administration/cooperative',
        icon: createIcon(FiLayers),
        allowedRoles: [UserRole.ADMIN]
      }
    ]
  },
  {
    title: 'Profile',
    path: 'profile',
    icon: createIcon(FiUser),
    allowedRoles: [UserRole.ADMIN]
  }
];
// Agriculteur menu items
export const agriculteurMenuItems = [
  {
    title: 'Tableau de bord',
    path: '/dashboard',
    icon: createIcon(FiHome),
    allowedRoles: [UserRole.AGRICULTEUR],
  },
  {
    title: 'Mes Cultures',
    path: '/mes-cultures',
    icon: createIcon(FiGrid),
    allowedRoles: [UserRole.AGRICULTEUR],
  },
  {
    title: 'Calendrier',
    path: '/calendrier',
    icon: createIcon(FiCalendar),
    allowedRoles: [UserRole.AGRICULTEUR],
  },
  {
    title: 'Paramètres',
    path: '/settings',
    icon: createIcon(FiSettings),
    allowedRoles: [UserRole.AGRICULTEUR],
  },
];

// Responsable menu items
export const responsableMenuItems = [
  {
    title: 'Tableau de bord',
    path: '/dashboard',
    icon: createIcon(FiHome),
    allowedRoles: [UserRole.RESPONSABLE, UserRole.ADMIN],
  },
  {
    title: 'Rapports',
    path: 'rapports',
    icon: createIcon(FiFileText),
    allowedRoles: [UserRole.RESPONSABLE, UserRole.ADMIN],
  },
  {
    title: 'Budgets',
    path: '/budgets',
    icon: createIcon(FiDollarSign),
    allowedRoles: [UserRole.RESPONSABLE, UserRole.ADMIN],
  },
  {
    title: 'Paramètres',
    path: '/settings',
    icon: createIcon(FiSettings),
    allowedRoles: [UserRole.RESPONSABLE],
  },
];

// Jury menu items
export const juryMenuItems = [
  {
    title: 'Tableau de bord',
    path: '',  
    icon: createIcon(FiHome),
    allowedRoles: [UserRole.JURY],
  },
  {
    title: 'Liste des agriculteurs',
    path: 'liste-agriculteurs',  
    icon: createIcon(FiUsers),
    allowedRoles: [UserRole.JURY],
  },
  {
    title: 'Évaluations',
    path: 'evaluation-jury/:id',  
    icon: createIcon(FiClipboard),
    allowedRoles: [UserRole.JURY],
  },
  {
    title: 'Notifications',
    path: '/notifications',
    icon: createIcon(FiMail),
    allowedRoles: [UserRole.JURY],
  },
  {
    title: 'Paramètres',
    path: '/settings',
    icon: createIcon(FiSettings),
    allowedRoles: [UserRole.JURY],
  },
];

// Combine all menu items based on user role
export const getAllMenuItems = (userRole) => {
  if (!userRole) return [];
  
  const combinedMenuItems = [];
  
  // Function to filter menu items by role
  const filterItemsByRole = (items) => {
    return items.filter(item => {
      // If the item has allowedRoles and userRole is not included, filter it out
      if (item.allowedRoles && !item.allowedRoles.includes(userRole)) {
        return false;
      }
      
      // If the item has children, filter them as well
      if (item.children) {
        item.children = filterItemsByRole(item.children);
        // If all children are filtered out
        if (item.children.length === 0) {
          return false;
        }
      }
      
      return true;
    });
  };

  switch (userRole) {
    case UserRole.ADMIN:
      combinedMenuItems.push(...filterItemsByRole(adminMenuItems));
      break;
    case UserRole.AGRICULTEUR:
      combinedMenuItems.push(...filterItemsByRole(agriculteurMenuItems));
      break;
    case UserRole.RESPONSABLE:
      combinedMenuItems.push(...filterItemsByRole(responsableMenuItems));
      break;
    case UserRole.JURY:
      combinedMenuItems.push(...filterItemsByRole(juryMenuItems));
      break;
    default:
      return [];
  }
  
  return combinedMenuItems;
};

export const menuItems = getAllMenuItems;
