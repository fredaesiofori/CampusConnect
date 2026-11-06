/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  Compass,
} from 'lucide-react';
import { Navbar, defaultNavLinks } from './components/navigation/Navbar';
import { Hero } from './components/hero/Hero';
import { Benefits } from './components/benefits/Benefits';
import { HowItWorks } from './components/how-it-works/HowItWorks';
import { TrustSection } from './components/trust/TrustSection';
import { FinalCTA } from './components/cta/FinalCTA';
import { Footer } from './components/footer/Footer';
import { InfoModal } from './components/ui/InfoModal';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { authService, User } from './services/auth';

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
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

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
      const hash = page === 'landing' ? '' : `#/${page}`;
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  // Initialize session and hash router listener on mount
  useEffect(() => {
    // 1. Initialize demo scholar account in local persistent storage
    authService.initDefaultDemoUser().catch(console.error);

    // 2. Check for existing active session
    const active = authService.getCurrentUser();
    if (active) {
      setCurrentUser(active);
      setIsLoggedIn(true);
    }

    // 3. Attach real-time Firebase Auth state subscriber for seamless multi-tab & cross-device sync
    const unsubscribeAuth = authService.initAuthListener((syncedUser) => {
      if (syncedUser) {
        setCurrentUser(syncedUser);
        setIsLoggedIn(true);
      } else {
        const currentActive = authService.getCurrentUser();
        if (currentActive && currentActive.isDemo) {
          setCurrentUser(currentActive);
          setIsLoggedIn(true);
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
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
        }
      } else if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'forgot-password') {
        setCurrentPage('forgot-password');
      } else if (hash === 'dashboard') {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('login');
          setAuthNotification('Please log in with your scholar credentials to access the private Student Hub.');
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

  // Handle post-signup: immediately guide student to the onboarding page
  const handleSignUpSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setAuthNotification(null);
    navigateTo('onboarding', `Account created! Welcome, ${user.fullName}.`);
  };

  // Handle login success
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setAuthNotification(null);
    if (user.profile && !user.profile.onboardingCompleted) {
      navigateTo('onboarding', `Welcome back, ${user.fullName}! Let's finish your profile.`);
    } else {
      navigateTo('dashboard', `Welcome back, ${user.fullName}! Directory Unlocked.`);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    navigateTo('landing', 'Logged out of Scholar Hub.');
  };

  const handleNavigate = (id: string) => {
    setActiveLinkId(id);
    const linkObj = defaultNavLinks.find((l) => l.id === id);

    if (id === 'about') {
      handlePlaceholderClick(
        'About Campus Connect',
        'Campus Connect was created to empower ambitious African students to discover universities, $0 application fees, test waivers, and international scholarships with full clarity and transparent requirements.'
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
      const targetEl = document.querySelector(linkObj.href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHeroSearch = (query: string, destination: string) => {
    setInitialSearchQuery(query);
    setInitialSearchDestination(destination);
    setSearchPromptContext({
      query: query.trim() || 'all study fields',
      destination: destination || 'Ghana & Global Destinations',
    });

    if (isLoggedIn) {
      navigateTo('dashboard', `Showing opportunities matching "${query || 'all'}"`);
    } else {
      navigateTo(
        'signup',
        undefined,
        `Create your free account to unlock verified matches for "${query || 'all fields'}" in ${destination || 'Ghana & Global'}.`
      );
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
          <div className="fixed bottom-6 right-6 z-50 bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <SignUpPage
          onNavigateHome={() => navigateTo('landing')}
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
          <div className="fixed bottom-6 right-6 z-50 bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <OnboardingPage
          currentUser={currentUser}
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
          <div className="fixed bottom-6 right-6 z-50 bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <LoginPage
          onNavigateHome={() => navigateTo('landing')}
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
          <div className="fixed bottom-6 right-6 z-50 bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <ForgotPasswordPage
          onNavigateHome={() => navigateTo('landing')}
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
          <div className="fixed bottom-6 right-6 z-50 bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
            <span>{feedbackToast}</span>
          </div>
        )}
        <StudentDashboard
          initialQuery={initialSearchQuery}
          initialDestination={initialSearchDestination}
          currentUser={currentUser}
          userEmail={currentUser?.email || 'scholar@campusconnect.edu'}
          onClose={() => navigateTo('landing')}
          onLogout={handleLogout}
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
        onExploreHubClick={() => navigateTo('dashboard')}
        isLoggedIn={isLoggedIn}
        userEmail={currentUser?.email}
        userName={currentUser?.fullName}
        onLogout={handleLogout}
      />

      {/* Floating Action Feedback Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#15152F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#25254D] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#E7B75C]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Informational Modal for About, Contact, Privacy Policy, Terms of Use, & Social channels */}
      <InfoModal
        isOpen={infoModalOpen}
        title={infoModalContent.title}
        description={infoModalContent.description}
        onClose={() => setInfoModalOpen(false)}
      />

      {/* Full Public Landing Page Sequences */}
      <main className="flex-1">
        {/* 1. Hero Section (With Two-Column Layout, Portrait on Right, Compact Search) */}
        <Hero onSearchSubmit={handleHeroSearch} />

        {/* 2. Platform Benefits Strip */}
        <Benefits />

        {/* 3. How It Works Section */}
        <HowItWorks onGetStartedClick={() => navigateTo('signup')} />

        {/* 4. Trust & Transparency Section */}
        <TrustSection />

        {/* 5. Final Call to Action Section */}
        <FinalCTA
          onCreateAccountClick={() => navigateTo('signup')}
          onLoginClick={() => navigateTo('login')}
        />
      </main>

      {/* 6. Comprehensive Professional Footer */}
      <Footer
        onNavigateSection={(href, label) => {
          showToast(`Jumped to ${label}`);
        }}
        onPlaceholderClick={handlePlaceholderClick}
        onLoginClick={() => navigateTo('login')}
        onSignUpClick={() => navigateTo('signup')}
      />
    </div>
  );
}
