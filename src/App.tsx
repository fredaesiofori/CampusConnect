/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  Compass,
} from 'lucide-react';
import { Navbar, defaultNavLinks } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { MobileLandingView } from './components/landing/MobileLandingView';
import { HowItWorks } from './components/how-it-works/HowItWorks';
import { FAQSection } from './components/faq/FAQSection';
import { FinalCTA } from './components/cta/FinalCTA';
import { NewsletterSection } from './components/newsletter/NewsletterSection';
import { Footer } from './components/footer/Footer';
import { InfoModal } from './components/ui/InfoModal';
import { SignOutConfirmModal } from './components/ui/SignOutConfirmModal';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { DashboardNavTab } from './components/dashboard/DashboardSidebar';
import { SettingsTab } from './components/dashboard/StudentSettingsCentre';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { authService, User } from './services/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  subscribeToUserNotifications,
  markUserNotificationReadInFirestore,
  markAllUserNotificationsReadInFirestore,
  deleteUserNotificationInFirestore,
  clearAllUserNotificationsInFirestore,
} from './services/firebase';
import {
  StudentNotificationRecord,
  recordDismissedNotificationIds,
} from './services/notifications';

type PageRoute = 'landing' | 'signup' | 'onboarding' | 'login' | 'forgot-password' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');
  const [activeLinkId, setActiveLinkId] = useState<string>('how-it-works');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authNotification, setAuthNotification] = useState<string | null>(null);
  const [searchPromptContext, setSearchPromptContext] = useState<{ query?: string; destination?: string } | null>(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [initialSearchDestination, setInitialSearchDestination] = useState('');
  const [initialDashboardTab, setInitialDashboardTab] = useState<DashboardNavTab | undefined>(undefined);
  const [initialDeadlineStatus, setInitialDeadlineStatus] = useState<string | undefined>(undefined);
  const [initialSettingsTab, setInitialSettingsTab] = useState<SettingsTab | undefined>(undefined);
  const [dashboardNavNonce, setDashboardNavNonce] = useState(0);
  const [landingNotifications, setLandingNotifications] = useState<StudentNotificationRecord[]>([]);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(() =>
    auth.currentUser && !auth.currentUser.isAnonymous ? auth.currentUser.uid : null
  );
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isExplicitSignOutRef = useRef(false);

  // Informational modal for About, Contact, Privacy, Terms & Social Placeholders
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState({
    title: '',
    description: '',
  });

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const navigateTo = useCallback(
    (page: PageRoute, toastMsg?: string, notificationMsg?: string) => {
      // Protect student dashboard & onboarding routes
      if ((page === 'dashboard' || page === 'onboarding') && !authService.getCurrentUser()) {
        setCurrentPage('login');
        setAuthNotification('Please log in with your scholar account to access the private Opportunity Directory and Student Hub.');
        window.location.hash = '#/login';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setCurrentPage(page);
      if (notificationMsg) {
        setAuthNotification(notificationMsg);
      } else {
        setAuthNotification(null);
      }

      if (toastMsg) {
        showToast(toastMsg);
      }

      // Sync window hash for clean URL state & history
      if (page === 'landing') {
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        const hash = `#/${page}`;
        if (window.location.hash !== hash) {
          window.location.hash = hash;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const navigateToStudentHome = useCallback(() => {
    setInitialSearchQuery('');
    setInitialSearchDestination('');
    setInitialDashboardTab('home');
    setInitialDeadlineStatus('all');
    setInitialSettingsTab(undefined);
    setDashboardNavNonce((n) => n + 1);
    if (!authService.getCurrentUser()) {
      navigateTo('landing');
      return;
    }
    setCurrentPage('dashboard');
    setAuthNotification(null);
    if (window.location.hash !== '#/home') {
      window.location.hash = '#/home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigateTo]);

  // Initialize session and hash router listener on mount
  useEffect(() => {
    // 1. Check for cached authenticated user while Firebase Auth resolves
    const active = authService.getCurrentUser();
    if (active) {
      setCurrentUser(active);
      setIsLoggedIn(true);
    }

    // 2. Attach real-time Firebase Auth state subscriber for seamless multi-tab & cross-device sync
    const unsubscribeAuth = authService.initAuthListener((syncedUser) => {
      if (syncedUser) {
        setCurrentUser(syncedUser);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        if (!isExplicitSignOutRef.current) {
          setCurrentPage((prev) => {
            if (prev === 'dashboard' || prev === 'onboarding') {
              setAuthNotification('Please log in with your scholar account to access the private Student Hub.');
              window.location.hash = '#/login';
              return 'login';
            }
            return prev;
          });
        }
      }
    });

    // 4. Parse initial hash
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (hash === 'signup') {
        setCurrentPage('signup');
      } else if (hash === 'onboarding') {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentPage('onboarding');
        } else {
          setCurrentPage('login');
          setAuthNotification('Please log in first to configure your profile.');
          window.location.hash = '#/login';
        }
      } else if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'forgot-password') {
        setCurrentPage('forgot-password');
      } else if (hash === 'home') {
        const user = authService.getCurrentUser();
        if (user) {
          setInitialDashboardTab('home');
          setDashboardNavNonce((n) => n + 1);
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('login');
          setAuthNotification('Please log in with your scholar account to access your Student Home.');
          window.location.hash = '#/login';
        }
      } else if (hash === 'dashboard') {
        const user = authService.getCurrentUser();
        if (user) {
          setInitialDashboardTab((prev) => (prev === 'home' ? 'overview' : prev));
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('login');
          setAuthNotification('Please log in with your scholar credentials to access the private Student Hub.');
          window.location.hash = '#/login';
        }
      } else {
        setCurrentPage('landing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      unsubscribeAuth();
    };
  }, []);

  // Track active Firebase UID and mirror real Firestore notifications when authenticated on the landing page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUid(fbUser && !fbUser.isAnonymous ? fbUser.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id || firebaseUid !== currentUser.id) {
      setLandingNotifications([]);
      return;
    }

    const unsubscribe = subscribeToUserNotifications(
      currentUser.id,
      (items) => {
        setLandingNotifications(items.slice(0, 100));
      },
      () => {}
    );
    return () => unsubscribe();
  }, [isLoggedIn, currentUser?.id, firebaseUid]);

  // Handle post-signup: guide new scholars to onboarding, or existing onboarded Google users to dashboard
  const handleSignUpSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setAuthNotification(null);
    if (user.profile?.onboardingCompleted) {
      navigateTo('dashboard', `Welcome back, ${user.fullName}! Directory Unlocked.`);
    } else {
      navigateTo('onboarding', `Account created! Welcome, ${user.fullName}.`);
    }
  };

  // Handle login success
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setAuthNotification(null);
    if (user.profile && !user.profile.onboardingCompleted) {
      navigateTo('onboarding', `Welcome, ${user.fullName}! Let's personalize your student profile.`);
    } else {
      navigateTo('dashboard', `Welcome back, ${user.fullName}! Directory Unlocked.`);
    }
  };

  const requestSignOut = useCallback(() => {
    setSignOutModalOpen(true);
  }, []);

  const cancelSignOut = useCallback(() => {
    if (!isSigningOut) {
      setSignOutModalOpen(false);
    }
  }, [isSigningOut]);

  const confirmSignOut = useCallback(async () => {
    setIsSigningOut(true);
    isExplicitSignOutRef.current = true;
    try {
      await authService.logoutAllSessions();
      setCurrentUser(null);
      setIsLoggedIn(false);
      setInitialDashboardTab(undefined);
      setInitialSearchQuery('');
      setInitialSearchDestination('');
      setInitialDeadlineStatus(undefined);
      setInitialSettingsTab(undefined);
      setLandingNotifications([]);
      setSearchPromptContext(null);
      setSignOutModalOpen(false);
      navigateTo('landing', 'Signed out of Campus Connect.');
    } finally {
      setIsSigningOut(false);
      setTimeout(() => {
        isExplicitSignOutRef.current = false;
      }, 100);
    }
  }, [navigateTo]);

  const handleAccountDeleted = useCallback(async () => {
    isExplicitSignOutRef.current = true;
    try {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setInitialDashboardTab(undefined);
      setInitialSearchQuery('');
      setInitialSearchDestination('');
      setInitialDeadlineStatus(undefined);
      setInitialSettingsTab(undefined);
      setLandingNotifications([]);
      setSearchPromptContext(null);
      setSignOutModalOpen(false);
      navigateTo('landing', 'Account permanently deleted.');
    } finally {
      setTimeout(() => {
        isExplicitSignOutRef.current = false;
      }, 100);
    }
  }, [navigateTo]);

  const handleNavigate = (id: string) => {
    setActiveLinkId(id);
    const linkObj = defaultNavLinks.find((l) => l.id === id);

    if (id === 'about') {
      handlePlaceholderClick(
        'About Campus Connect',
        'Campus Connect is a global university, admissions, and educational opportunities platform helping students discover accredited institutions, explore undergraduate and postgraduate programs, find fee waivers and test-optional options, locate scholarships, and organize applications with COVA AI.'
      );
      return;
    }

    if (id === 'opportunities') {
      if (isLoggedIn) {
        navigateTo('dashboard', 'Opened Student Directory');
      } else {
        navigateTo(
          'signup',
          undefined,
          'Create a free student account to explore verified universities, $0 fees, and waivers.'
        );
      }
      return;
    }

    if (linkObj?.href && linkObj.href.startsWith('#')) {
      const targetEl = document.querySelector(linkObj.href) as HTMLElement | null;
      if (targetEl && targetEl.offsetParent !== null) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'benefits') {
        const mobileBenefits = document.getElementById('mobile-why-campus-connect');
        mobileBenefits?.scrollIntoView({ behavior: 'smooth' });
      } else if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenDashboardQuickAction = (options: {
    tab: DashboardNavTab;
    deadlineStatus?: string;
    settingsTab?: SettingsTab;
    guestMessage: string;
    toast?: string;
  }) => {
    if (isLoggedIn) {
      setInitialSearchQuery('');
      setInitialSearchDestination('');
      setInitialDashboardTab(options.tab);
      setInitialDeadlineStatus(options.deadlineStatus ?? 'all');
      setInitialSettingsTab(options.settingsTab);
      setDashboardNavNonce((n) => n + 1);
      navigateTo('dashboard', options.toast);
    } else {
      navigateTo('signup', undefined, options.guestMessage);
    }
  };

  const handleHeroSearch = (query: string, destination: string) => {
    setInitialSearchQuery(query);
    setInitialSearchDestination(destination);
    setInitialDashboardTab('universities');
    setInitialDeadlineStatus('all');
    setInitialSettingsTab(undefined);
    setDashboardNavNonce((n) => n + 1);
    setSearchPromptContext({
      query: query.trim() || 'all study fields',
      destination: destination || 'All Countries',
    });

    if (isLoggedIn) {
      navigateTo('dashboard', `Showing opportunities matching "${query || 'all'}"`);
    } else {
      navigateTo(
        'signup',
        undefined,
        `Create your free account to unlock verified matches for "${query || 'all fields'}" in ${destination || 'all global destinations'}.`
      );
    }
  };

  const handleLandingMarkRead = async (notificationId: string, read: boolean) => {
    setLandingNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read } : n))
    );
    if (currentUser?.id && firebaseUid === currentUser.id) {
      await markUserNotificationReadInFirestore(currentUser.id, notificationId, read);
    }
  };

  const handleLandingMarkAllRead = async () => {
    const unreadIds = landingNotifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setLandingNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (currentUser?.id && firebaseUid === currentUser.id) {
      await markAllUserNotificationsReadInFirestore(currentUser.id, unreadIds);
    }
  };

  const handleLandingDeleteNotification = async (notificationId: string) => {
    if (currentUser?.id) {
      recordDismissedNotificationIds(currentUser.id, [notificationId]);
    }
    setLandingNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    if (currentUser?.id && firebaseUid === currentUser.id) {
      await deleteUserNotificationInFirestore(currentUser.id, notificationId);
      await authService.recordDismissedNotificationIdsSynced([notificationId]);
    }
  };

  const handleLandingClearAllNotifications = async () => {
    const allIds = landingNotifications.map((n) => n.id);
    if (currentUser?.id && allIds.length > 0) {
      recordDismissedNotificationIds(currentUser.id, allIds);
    }
    setLandingNotifications([]);
    if (currentUser?.id && firebaseUid === currentUser.id) {
      await clearAllUserNotificationsInFirestore(currentUser.id, allIds);
      if (allIds.length > 0) {
        await authService.recordDismissedNotificationIdsSynced(allIds);
      }
    }
  };

  const handlePlaceholderClick = (title: string, description: string) => {
    setInfoModalContent({ title, description });
    setInfoModalOpen(true);
  };

  // ==========================================
  // VIEW 1: Dedicated Sign-Up Page
  // ==========================================
  if (currentPage === 'signup') {
    return (
      <>
        {feedbackToast && (
          <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C] shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <SignUpPage
          onNavigateHome={() => (isLoggedIn ? navigateToStudentHome() : navigateTo('landing'))}
          onNavigateLogin={() => navigateTo('login')}
          onSuccess={handleSignUpSuccess}
          searchContext={searchPromptContext}
        />
      </>
    );
  }

  // ==========================================
  // VIEW 2: Dedicated Student Onboarding Page
  // ==========================================
  if (currentPage === 'onboarding') {
    return (
      <>
        {feedbackToast && (
          <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C] shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <OnboardingPage
          currentUser={currentUser}
          onNavigateHome={() => (isLoggedIn ? navigateToStudentHome() : navigateTo('landing'))}
          onComplete={(updatedUser) => {
            setCurrentUser(updatedUser);
            navigateTo('dashboard', 'Academic preferences saved securely! Welcome to your Student Hub.');
          }}
          onSkip={() => {
            navigateTo('dashboard', 'You can update your profile anytime from Preferences.');
          }}
        />
      </>
    );
  }

  // ==========================================
  // VIEW 3: Dedicated Login Page
  // ==========================================
  if (currentPage === 'login') {
    return (
      <>
        {feedbackToast && (
          <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C] shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <LoginPage
          onNavigateHome={() => (isLoggedIn ? navigateToStudentHome() : navigateTo('landing'))}
          onNavigateSignUp={() => navigateTo('signup')}
          onNavigateForgotPassword={() => navigateTo('forgot-password')}
          onSuccess={handleLoginSuccess}
          notificationMessage={authNotification}
        />
      </>
    );
  }

  // ==========================================
  // VIEW 3: Dedicated Password Recovery Page
  // ==========================================
  if (currentPage === 'forgot-password') {
    return (
      <>
        {feedbackToast && (
          <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C] shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <ForgotPasswordPage
          onNavigateHome={() => (isLoggedIn ? navigateToStudentHome() : navigateTo('landing'))}
          onNavigateLogin={() => navigateTo('login')}
        />
      </>
    );
  }

  // ==========================================
  // VIEW 4: Protected Private Student Dashboard
  // ==========================================
  if (currentPage === 'dashboard') {
    return (
      <>
        {feedbackToast && (
          <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-[calc(100vw-2rem)] bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C] shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <SignOutConfirmModal
          isOpen={signOutModalOpen}
          isBusy={isSigningOut}
          onCancel={cancelSignOut}
          onConfirm={confirmSignOut}
        />
        <StudentDashboard
          initialQuery={initialSearchQuery}
          initialDestination={initialSearchDestination}
          initialTab={initialDashboardTab}
          initialDeadlineStatus={initialDeadlineStatus}
          initialSettingsTab={initialSettingsTab}
          navigationNonce={dashboardNavNonce}
          currentUser={currentUser}
          userEmail={currentUser?.email || 'scholar@campusconnect.edu'}
          onClose={() => navigateTo('landing')}
          onLogout={requestSignOut}
          onAccountDeleted={handleAccountDeleted}
        />
      </>
    );
  }

  // ==========================================
  // VIEW 5: Public Landing Page (Concise, zero unauthenticated scholarship cards)
  // ==========================================
  return (
    <div className="min-h-screen bg-white text-[#15152F] flex flex-col selection:bg-[#6846F5] selection:text-white">
      {/* 1. Established Top Navigation Bar (Sticky Top) */}
      <Navbar
        activeLinkId={activeLinkId}
        onNavigate={handleNavigate}
        onLoginClick={() => navigateTo('login')}
        onGetStartedClick={() => navigateTo('signup')}
        onLogoClick={navigateToStudentHome}
        onExploreHubClick={() => {
          setInitialSearchQuery('');
          setInitialSearchDestination('');
          setInitialDashboardTab('overview');
          setInitialDeadlineStatus('all');
          setInitialSettingsTab(undefined);
          setDashboardNavNonce((n) => n + 1);
          navigateTo('dashboard');
        }}
        isLoggedIn={isLoggedIn}
        userEmail={currentUser?.email}
        userName={currentUser?.fullName}
        onLogout={requestSignOut}
        notifications={landingNotifications}
        onMarkNotificationRead={handleLandingMarkRead}
        onMarkAllNotificationsRead={handleLandingMarkAllRead}
        onDeleteNotification={handleLandingDeleteNotification}
        onClearAllNotifications={handleLandingClearAllNotifications}
        onNavigateNotification={(notif) => {
          void handleLandingMarkRead(notif.id, true);
          const tab: DashboardNavTab =
            notif.actionTab === 'settings' || notif.actionSection === 'notifications'
              ? 'settings'
              : notif.actionTab || 'overview';
          handleOpenDashboardQuickAction({
            tab,
            settingsTab:
              notif.actionTab === 'settings' || notif.actionSection === 'notifications'
                ? 'notifications'
                : undefined,
            guestMessage: 'Log in to view your notifications.',
          });
        }}
        onOpenNotificationSettings={() =>
          handleOpenDashboardQuickAction({
            tab: 'settings',
            settingsTab: 'notifications',
            guestMessage: 'Log in to manage your notification settings.',
          })
        }
      />

      {/* Floating Action Feedback Toast */}
      {feedbackToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-[calc(100vw-2rem)] bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#E7B75C] shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      <SignOutConfirmModal
        isOpen={signOutModalOpen}
        isBusy={isSigningOut}
        onCancel={cancelSignOut}
        onConfirm={confirmSignOut}
      />

      {/* Informational Modal for About, Contact, Privacy Policy, Terms of Use, & Social channels */}
      <InfoModal
        isOpen={infoModalOpen}
        title={infoModalContent.title}
        description={infoModalContent.description}
        onClose={() => setInfoModalOpen(false)}
      />

      {/* Unified Public Landing Page Sequences (Consistent Mobile, Tablet & Desktop) */}
      <main className="flex-1">
        <MobileLandingView
          isLoggedIn={isLoggedIn}
          onGetStartedClick={() => navigateTo('signup')}
          onExploreUniversities={() => handleHeroSearch('', 'All Countries')}
          onOpenScholarships={() =>
            handleOpenDashboardQuickAction({
              tab: 'scholarships',
              guestMessage:
                'Create a free student account to explore verified scholarships and funded university programs.',
              toast: 'Opened Scholarships & Grants',
            })
          }
          onOpenResources={() =>
            handleOpenDashboardQuickAction({
              tab: 'resources',
              guestMessage:
                'Create a free student account to access admissions guides, waiver playbooks, and preparation tips.',
              toast: 'Opened Academic Resources',
            })
          }
          onOpenDeadlines={() =>
            handleOpenDashboardQuickAction({
              tab: 'universities',
              deadlineStatus: 'open-or-rolling',
              guestMessage:
                'Create a free student account to track open and rolling university intake deadlines.',
              toast: 'Showing Open & Rolling Deadlines',
            })
          }
          onSelectDestination={(country) => handleHeroSearch('', country)}
          onTurnOnAlerts={() => {
            if (isLoggedIn) {
              handleOpenDashboardQuickAction({
                tab: 'settings',
                settingsTab: 'notifications',
                guestMessage: 'Log in to manage your notification preferences.',
                toast: 'Opened Notification Preferences',
              });
              return;
            }
            const newsletterEl = document.getElementById('newsletter');
            if (newsletterEl) {
              newsletterEl.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                const emailInput = document.getElementById('newsletter-email');
                emailInput?.focus();
              }, 400);
            }
          }}
        />

        {/* How It Works Section */}
        <HowItWorks onGetStartedClick={() => navigateTo('signup')} />

        {/* Frequently Asked Questions (Collapsed by Default) */}
        <FAQSection
          onOpenAssistant={() => navigateTo('dashboard', 'Opening COVA AI Scholarship Advisor...')}
          onExploreUniversities={() => handleHeroSearch('', 'All Countries')}
        />

        {/* Final Call to Action Section */}
        <FinalCTA
          onCreateAccountClick={() => navigateTo('signup')}
          onLoginClick={() => navigateTo('login')}
        />

        {/* Opportunity Updates Signup Form */}
        <NewsletterSection
          onSubscribed={(email) => {
            showToast(`Subscribed ${email} to opportunity updates!`);
          }}
        />
      </main>

      {/* Comprehensive Professional Footer */}
      <Footer
        onNavigateSection={(href, label) => {
          showToast(`Jumped to ${label}`);
        }}
        onPlaceholderClick={handlePlaceholderClick}
        onLoginClick={() => navigateTo('login')}
        onSignUpClick={() => navigateTo('signup')}
        onLogoClick={isLoggedIn ? navigateToStudentHome : undefined}
        className="pb-22 md:pb-10"
      />

      {/* Mobile Bottom Navigation Bar (< md) */}
      <MobileBottomNav
        activeTab="home"
        onSelectHome={() => {
          if (isLoggedIn) {
            handleOpenDashboardQuickAction({
              tab: 'home',
              guestMessage: 'Log in to access your Student Home.',
            });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onSelectExplore={() => handleHeroSearch('', 'All Countries')}
        onSelectDashboard={() =>
          handleOpenDashboardQuickAction({
            tab: 'overview',
            guestMessage:
              'Create a free student account or log in to open your Student Dashboard.',
          })
        }
        onSelectProfile={() =>
          handleOpenDashboardQuickAction({
            tab: 'profile',
            guestMessage:
              'Create a free student account or log in to view and complete your Student Profile.',
          })
        }
      />
    </div>
  );
}
