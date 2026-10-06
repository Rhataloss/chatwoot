export const guideModules = {
  full: {
    labelKey: 'USER_GUIDE.MODULES.FULL',
    descriptionKey: 'USER_GUIDE.MODULES.FULL_DESCRIPTION',
    icon: 'i-lucide-play-circle',
    pages: [
      {
        route: 'home',
        titleKey: 'USER_GUIDE.STEPS.CONVERSATIONS.TITLE',
        steps: [
          {
            element: '[data-tour="sidebar"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SIDEBAR.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SIDEBAR.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="search-bar"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SEARCH_BAR.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SEARCH_BAR.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="compose-button"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.COMPOSE_BUTTON.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.COMPOSE_BUTTON.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="nav-conversations"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.NAV_CONVERSATIONS.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.NAV_CONVERSATIONS.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="chat-list-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CHAT_LIST_HEADER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CHAT_LIST_HEADER.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="chat-list"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CHAT_LIST.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CHAT_LIST.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="conversation-box"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONVERSATION_BOX.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONVERSATION_BOX.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="reply-box"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.REPLY_BOX.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.REPLY_BOX.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="profile-menu"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.PROFILE_MENU.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.PROFILE_MENU.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'contacts_dashboard_index',
        titleKey: 'USER_GUIDE.STEPS.CONTACTS_HEADER.TITLE',
        steps: [
          {
            element: '[data-tour="contacts-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONTACTS_HEADER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONTACTS_HEADER.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="contacts-search"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONTACTS_SEARCH.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONTACTS_SEARCH.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="contacts-list"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONTACTS_LIST.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONTACTS_LIST.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'campaigns_whatsapp_index',
        titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_WHATSAPP.TITLE',
        steps: [
          {
            element: '[data-tour="new-campaign"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="campaign-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_WHATSAPP.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_WHATSAPP.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'campaigns_brevo_index',
        titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_BREVO.TITLE',
        steps: [
          {
            element: '[data-tour="campaign-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_BREVO.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_BREVO.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="new-campaign"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.TITLE',
              descriptionKey:
                'USER_GUIDE.STEPS.CAMPAIGNS_BREVO_NEW.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'campaigns_meta_templates_index',
        titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META.TITLE',
        steps: [
          {
            element: '[data-tour="campaign-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="new-campaign"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META_NEW.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'general_settings_index',
        titleKey: 'USER_GUIDE.STEPS.SETTINGS_HEADER.TITLE',
        steps: [
          {
            element: '[data-tour="settings-nav"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SETTINGS_NAV.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SETTINGS_NAV.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="settings-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SETTINGS_HEADER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SETTINGS_HEADER.DESCRIPTION',
            },
          },
        ],
      },
    ],
  },
  sidebar: {
    labelKey: 'USER_GUIDE.MODULES.SIDEBAR',
    descriptionKey: 'USER_GUIDE.MODULES.SIDEBAR_DESCRIPTION',
    icon: 'i-lucide-panel-left',
    pages: [
      {
        route: 'home',
        titleKey: 'USER_GUIDE.STEPS.SIDEBAR.TITLE',
        steps: [
          {
            element: '[data-tour="sidebar"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SIDEBAR.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SIDEBAR.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="account-switcher"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.ACCOUNT_SWITCHER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.ACCOUNT_SWITCHER.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="search-bar"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SEARCH_BAR.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SEARCH_BAR.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="compose-button"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.COMPOSE_BUTTON.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.COMPOSE_BUTTON.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="nav-inbox"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.NAV_INBOX.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.NAV_INBOX.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="nav-conversations"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.NAV_CONVERSATIONS.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.NAV_CONVERSATIONS.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="nav-contacts"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.NAV_CONTACTS.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.NAV_CONTACTS.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="nav-reports"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.NAV_REPORTS.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.NAV_REPORTS.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="nav-settings"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.NAV_SETTINGS.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.NAV_SETTINGS.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="profile-menu"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.PROFILE_MENU.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.PROFILE_MENU.DESCRIPTION',
            },
          },
        ],
      },
    ],
  },
  conversations: {
    labelKey: 'USER_GUIDE.MODULES.CONVERSATIONS',
    descriptionKey: 'USER_GUIDE.MODULES.CONVERSATIONS_DESCRIPTION',
    icon: 'i-lucide-message-square',
    pages: [
      {
        route: 'home',
        titleKey: 'USER_GUIDE.STEPS.CHAT_LIST_HEADER.TITLE',
        steps: [
          {
            element: '[data-tour="chat-list-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CHAT_LIST_HEADER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CHAT_LIST_HEADER.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="filter-button"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.FILTER_BUTTON.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.FILTER_BUTTON.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="chat-list"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CHAT_LIST.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CHAT_LIST.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="conversation-box"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONVERSATION_BOX.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONVERSATION_BOX.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="contact-sidebar-toggle"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONTACT_SIDEBAR_TOGGLE.TITLE',
              descriptionKey:
                'USER_GUIDE.STEPS.CONTACT_SIDEBAR_TOGGLE.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="reply-box"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.REPLY_BOX.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.REPLY_BOX.DESCRIPTION',
            },
          },
        ],
      },
    ],
  },
  contacts: {
    labelKey: 'USER_GUIDE.MODULES.CONTACTS',
    descriptionKey: 'USER_GUIDE.MODULES.CONTACTS_DESCRIPTION',
    icon: 'i-lucide-users',
    pages: [
      {
        route: 'contacts_dashboard_index',
        titleKey: 'USER_GUIDE.STEPS.CONTACTS_HEADER.TITLE',
        steps: [
          {
            element: '[data-tour="contacts-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONTACTS_HEADER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONTACTS_HEADER.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="contacts-search"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONTACTS_SEARCH.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONTACTS_SEARCH.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="contacts-list"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CONTACTS_LIST.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CONTACTS_LIST.DESCRIPTION',
            },
          },
        ],
      },
    ],
  },
  campaigns: {
    labelKey: 'USER_GUIDE.MODULES.CAMPAIGNS',
    descriptionKey: 'USER_GUIDE.MODULES.CAMPAIGNS_DESCRIPTION',
    icon: 'i-lucide-megaphone',
    pages: [
      {
        route: 'campaigns_whatsapp_index',
        titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_WHATSAPP.TITLE',
        steps: [
          {
            element: '[data-tour="campaign-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_WHATSAPP.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_WHATSAPP.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="new-campaign"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'campaigns_brevo_index',
        titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_BREVO.TITLE',
        steps: [
          {
            element: '[data-tour="campaign-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_BREVO.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_BREVO.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="new-campaign"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.TITLE',
              descriptionKey:
                'USER_GUIDE.STEPS.CAMPAIGNS_BREVO_NEW.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'campaigns_meta_templates_index',
        titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META.TITLE',
        steps: [
          {
            element: '[data-tour="campaign-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="new-campaign"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.CAMPAIGNS_NEW.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.CAMPAIGNS_META_NEW.DESCRIPTION',
            },
          },
        ],
      },
    ],
  },
  settings: {
    labelKey: 'USER_GUIDE.MODULES.SETTINGS',
    descriptionKey: 'USER_GUIDE.MODULES.SETTINGS_DESCRIPTION',
    icon: 'i-lucide-settings',
    pages: [
      {
        route: 'general_settings_index',
        titleKey: 'USER_GUIDE.STEPS.SETTINGS_HEADER.TITLE',
        steps: [
          {
            element: '[data-tour="settings-nav"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SETTINGS_NAV.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SETTINGS_NAV.DESCRIPTION',
            },
          },
          {
            element: '[data-tour="settings-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.SETTINGS_HEADER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.SETTINGS_HEADER.DESCRIPTION',
            },
          },
        ],
      },
      {
        route: 'account_overview_reports',
        titleKey: 'USER_GUIDE.STEPS.REPORTS_HEADER.TITLE',
        steps: [
          {
            element: '[data-tour="reports-header"]',
            popover: {
              titleKey: 'USER_GUIDE.STEPS.REPORTS_HEADER.TITLE',
              descriptionKey: 'USER_GUIDE.STEPS.REPORTS_HEADER.DESCRIPTION',
            },
          },
        ],
      },
    ],
  },
};

export function getModuleMeta(key) {
  const module = guideModules[key];
  return module
    ? {
        key,
        labelKey: module.labelKey,
        descriptionKey: module.descriptionKey,
        icon: module.icon,
      }
    : null;
}

export function getAllModuleKeys() {
  return Object.keys(guideModules);
}

export function getModuleSteps(key) {
  const module = guideModules[key];
  if (!module) {
    throw new Error(`User guide module not found: ${key}`);
  }
  return module.pages;
}

export function isMultiPageModule(steps) {
  return Array.isArray(steps?.[0]?.steps);
}
