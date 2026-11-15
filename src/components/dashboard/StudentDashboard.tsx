/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Globe,
  Award,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  X,
  Filter,
  Info,
  Calendar,
  Edit3,
  Check,
  Clock,
  Send,
  Trophy,
  AlertCircle,
  Database,
  Server,
  Lock,
  RefreshCw,
  RotateCw,
  Menu,
  Target,
  ArrowUpRight,
  ArrowLeft,
  LayoutDashboard,
  BookOpen,
  Settings,
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { authenticOpportunities, OpportunityItem, evaluateOpportunityDeadline } from '../../data/opportunities';
import { Button } from '../ui/Button';
import {
  authService,
  User,
  TargetPriority,
  TargetListItem,
  ActiveApplicationItem,
  ActiveApplicationStage,
} from '../../services/auth';
import {
  auth,
  currentFirebaseProjectId,
  currentFirestoreDatabaseId,
  testFirestoreConnection,
  seedVerifiedOpportunitiesToFirestore,
  fetchVerifiedOpportunitiesFromFirestore,
  checkCurrentUserIsAdmin,
  StudentNotificationRecord,
  subscribeToUserNotifications,
  batchCreateUserNotificationsInFirestore,
  markUserNotificationReadInFirestore,
  markAllUserNotificationsReadInFirestore,
  deleteUserNotificationInFirestore,
  clearAllUserNotificationsInFirestore,
} from '../../services/firebase';
import {
  generateSmartNotifications,
  buildOpportunityRequirementSignature,
  loadStoredCatalogBaseline,
  saveStoredCatalogBaseline,
  loadDismissedNotificationIds,
  recordDismissedNotificationIds,
} from '../../services/notifications';
import { DashboardSidebar, DashboardNavTab } from './DashboardSidebar';
import { UniversityCard } from './UniversityCard';
import { TargetTrackerBoard, ApplicationStage } from './TargetTrackerBoard';
import { SavedOpportunitiesView, BookmarkFilter } from './SavedOpportunitiesView';
import { ApplicationsView, StageFilter } from './ApplicationsView';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { StudentSettingsCentre, SettingsTab } from './StudentSettingsCentre';
import { NotificationBellCenter } from './NotificationBellCenter';
import { UniversitySearchFilters } from './UniversitySearchFilters';
import { MobileDashboardOverview } from './MobileDashboardOverview';
import { MobileBottomNav, MobileBottomNavTab } from '../navigation/MobileBottomNav';
import { Logo } from '../brand/Logo';
import { UniversityLogo } from '../ui/UniversityLogo';
import { StudentInitialsAvatar } from '../ui/StudentInitialsAvatar';
import { CovaAssistant } from '../assistant/CovaAssistant';
import { ResourcesView } from './ResourcesView';
import { ProfileView } from './ProfileView';
import { DesktopDashboardOverview } from './DesktopDashboardOverview';
import { FeaturedUniversityBanner } from './FeaturedUniversityBanner';
import {
  doesOpportunityMatchCountry,
  resolveExploreBannerOpportunity,
  resolveStudentProfileCountry,
  sortRelevantExploreOpportunities,
} from '../../utils/universityDirectory';

export interface InstitutionBadgeProps {
  item?: OpportunityItem;
  logo?: OpportunityItem['logo'];
  officialName?: string;
  shortName?: string;
  countryFlag?: string;
  countryCode?: string;
  isVerified?: boolean;
  institutionType?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const InstitutionLogo: React.FC<InstitutionBadgeProps> = ({
  item,
  logo,
  officialName = '',
  shortName = '',
  size = 'md',
  isVerified = true,
}) => {
  return (
    <UniversityLogo
      item={item}
      logo={logo}
      officialName={officialName}
      shortName={shortName}
      size={size as any}
      showVerifiedShield={isVerified}
    />
  );
};

export const EvidenceBadge = InstitutionLogo;

export interface StudentDashboardProps {
  initialQuery?: string;
  initialDestination?: string;
  initialTab?: DashboardNavTab;
  initialDeadlineStatus?: string;
  initialSettingsTab?: SettingsTab;
  navigationNonce?: number;
  onClose?: () => void;
  currentUser?: User | null;
  userEmail?: string;
  onLogout?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  initialQuery = '',
  initialDestination = '',
  initialTab,
  initialDeadlineStatus,
  initialSettingsTab,
  navigationNonce,
  onClose,
  currentUser,
  userEmail = 'scholar@campusconnect.edu',
  onLogout,
}) => {
  const initialUser = currentUser || authService.getCurrentUser();
  const [activeUser, setActiveUser] = useState<User | null>(initialUser);

  // Active Main Navigation Section (Default to explicit initialTab, or 'universities' if query/destination provided, else 'overview')
  const [activeTab, setActiveTab] = useState<DashboardNavTab>(
    initialTab || (initialQuery || initialDestination ? 'universities' : 'overview')
  );

  // Dedicated sub-view inside Overview for Saved Opportunities & Applications
  const [overviewSection, setOverviewSection] = useState<'home' | 'saved' | 'applications'>('home');
  const [savedFilterState, setSavedFilterState] = useState<{
    filter: BookmarkFilter;
    nonce: number;
  }>({ filter: 'all', nonce: 0 });
  const [appViewState, setAppViewState] = useState<{
    filter: StageFilter;
    filterNonce: number;
    openStartPickerNonce: number;
  }>({ filter: 'all', filterNonce: 0, openStartPickerNonce: 0 });
  const [settingsInitialTab, setSettingsInitialTab] = useState<SettingsTab>(initialSettingsTab || 'account');
  const [settingsTabNonce, setSettingsTabNonce] = useState<number>(initialSettingsTab ? 1 : 0);

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Smart Notification Centre state
  const [notifications, setNotifications] = useState<StudentNotificationRecord[]>([]);
  const [notificationsLoaded, setNotificationsLoaded] = useState<boolean>(false);
  const [firebaseAuthResolved, setFirebaseAuthResolved] = useState<boolean>(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(() =>
    auth.currentUser && !auth.currentUser.isAnonymous ? auth.currentUser.uid : null
  );
  const createdNotificationIdsRef = useRef<Set<string>>(new Set());

  // Search & Filter Dimensions
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedDestination, setSelectedDestination] = useState(
    !initialDestination || initialDestination.toLowerCase().includes('all') ? '' : initialDestination
  );
  const [selectedNationality, setSelectedNationality] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedFunding, setSelectedFunding] = useState<string>('all');
  const [selectedAppFee, setSelectedAppFee] = useState<string>('all');
  const [selectedTestPolicy, setSelectedTestPolicy] = useState<string>('all');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string>('all');
  const [selectedDeadlineStatus, setSelectedDeadlineStatus] = useState<string>(initialDeadlineStatus || 'all');
  const [sortBy, setSortBy] = useState<'relevant' | 'name-asc' | 'free-fee' | 'funded'>('relevant');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(6);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // User's saved country strictly from student profile/account (never hardcodes any default country)
  const initialProfileCountry = resolveStudentProfileCountry(initialUser);
  const [selectedUserCountry, setSelectedUserCountry] = useState<string>(initialProfileCountry);

  // Sync with active user profile updates
  useEffect(() => {
    setSelectedUserCountry(resolveStudentProfileCountry(activeUser));
  }, [activeUser?.profile?.countryOfResidence, activeUser?.country, activeUser?.profile?.nationality]);

  // Country match helper
  const isCountryMatch = doesOpportunityMatchCountry;

  // Selected opportunity for detail modal matching mockup screen 3
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);

  // Feedback toast (with honest error variant)
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Saved opportunities set (Personal Bookmarks ONLY)
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(() => {
    const fromUser = initialUser?.savedOpportunities || [];
    return new Set(fromUser);
  });

  // Target List (Future Study Goals ONLY — completely separate from Saved Opportunities)
  const [targetList, setTargetList] = useState<Record<string, TargetListItem>>(() => {
    return initialUser?.targetList || {};
  });

  // Active Applications (Started Applications ONLY — excludes bookmarks & unstarted targets)
  const [activeApplications, setActiveApplications] = useState<Record<string, ActiveApplicationItem>>(() => {
    if (initialUser?.activeApplications && Object.keys(initialUser.activeApplications).length > 0) {
      return initialUser.activeApplications;
    }
    const hydrated: Record<string, ActiveApplicationItem> = {};
    const tracker = initialUser?.applicationTracker || {};
    Object.entries(tracker).forEach(([oppId, stage]) => {
      if (stage === 'preparing' || stage === 'submitted' || stage === 'accepted') {
        const now = new Date().toISOString();
        hydrated[oppId] = {
          opportunityId: oppId,
          stage,
          completedTasks: [],
          startedAt: now,
          updatedAt: now,
        };
      }
    });
    return hydrated;
  });

  // Legacy tracker status map synced for COVA compatibility
  const [applicationTracker, setApplicationTracker] = useState<Record<string, ApplicationStage>>(() => {
    return (initialUser?.applicationTracker as Record<string, ApplicationStage>) || {};
  });

  // Sync initial query/destination/tab from Hero Search or Landing Quick Access
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      setOverviewSection('home');
      setCurrentPage(1);
    }
    if (initialDeadlineStatus !== undefined) {
      setSelectedDeadlineStatus(initialDeadlineStatus || 'all');
    }
    if (initialSettingsTab) {
      setSettingsInitialTab(initialSettingsTab);
      setSettingsTabNonce((n) => n + 1);
    }
  }, [initialTab, initialDeadlineStatus, initialSettingsTab, navigationNonce]);

  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== '') {
      setSearchQuery(initialQuery);
      setActiveTab('universities');
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialDestination !== undefined && initialDestination !== '') {
      setSelectedDestination(
        !initialDestination || initialDestination.toLowerCase().includes('all') ? '' : initialDestination
      );
      setActiveTab('universities');
    }
  }, [initialDestination]);

  // Persistent Cloud Database & Firestore Connection State
  const [dbState, setDbState] = useState<{
    isConnected: boolean;
    projectId: string;
    databaseId: string;
    isSyncing: boolean;
    error?: string;
  }>({
    isConnected: true,
    projectId: currentFirebaseProjectId,
    databaseId: currentFirestoreDatabaseId,
    isSyncing: false,
  });

  // Verified Opportunities State (Hydrated from Firestore & backed by verified registry)
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(authenticOpportunities);

  const showNotification = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Helper to navigate across Dashboard sections while supporting browser Back button
  const navigateToDashboardView = (
    tab: DashboardNavTab,
    section: 'home' | 'saved' | 'applications' = 'home'
  ) => {
    if (tab !== 'settings') {
      setSettingsInitialTab('account');
    }
    if (section === 'saved') {
      setSavedFilterState((prev) => ({ filter: 'all', nonce: prev.nonce + 1 }));
    }
    if (section === 'applications') {
      setAppViewState((prev) => ({
        filter: 'all',
        filterNonce: prev.filterNonce + 1,
        openStartPickerNonce: prev.openStartPickerNonce,
      }));
    }
    setActiveTab(tab);
    setOverviewSection(section);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({ dashboardTab: tab, overviewSection: section }, '');
    } catch {
      // Ignore if history push is restricted
    }
  };

  const handleOpenSavedFiltered = (filter: BookmarkFilter) => {
    setSavedFilterState((prev) => ({ filter, nonce: prev.nonce + 1 }));
    setActiveTab('overview');
    setOverviewSection('saved');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({ dashboardTab: 'overview', overviewSection: 'saved' }, '');
    } catch {
      // Ignore
    }
  };

  const handleOpenApplicationsFiltered = (filter: StageFilter, openStartPicker = false) => {
    setAppViewState((prev) => ({
      filter,
      filterNonce: prev.filterNonce + 1,
      openStartPickerNonce: openStartPicker ? prev.openStartPickerNonce + 1 : prev.openStartPickerNonce,
    }));
    setActiveTab('overview');
    setOverviewSection('applications');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({ dashboardTab: 'overview', overviewSection: 'applications' }, '');
    } catch {
      // Ignore
    }
  };

  const handleOpenNotificationSettings = () => {
    setSettingsInitialTab('notifications');
    setSettingsTabNonce((n) => n + 1);
    navigateToDashboardView('settings', 'home');
  };

  const handleBackToOverview = () => {
    setActiveTab('overview');
    setOverviewSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({ dashboardTab: 'overview', overviewSection: 'home' }, '');
    } catch {
      // Ignore
    }
  };

  // Support browser Back/Forward navigation within Dashboard views
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as {
        dashboardTab?: DashboardNavTab;
        overviewSection?: 'home' | 'saved' | 'applications';
      } | null;
      if (state && state.dashboardTab) {
        setActiveTab(state.dashboardTab);
        setOverviewSection(state.overviewSection || 'home');
      } else {
        setActiveTab('overview');
        setOverviewSection('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial query/destination from Hero Search if updated
  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialDestination !== undefined) {
      setSelectedDestination(
        !initialDestination || initialDestination.toLowerCase().includes('all') ? '' : initialDestination
      );
    }
  }, [initialDestination]);

  useEffect(() => {
    testFirestoreConnection().then((res) => {
      setDbState((prev) => ({
        ...prev,
        isConnected: res.isConnected,
        error: res.error,
      }));
    });

    // Hydrate authenticated student's live Firestore profile, bookmarks, targets, and applications
    authService.refreshCurrentUserFromFirestore().then((freshUser) => {
      if (freshUser) {
        setActiveUser({ ...freshUser });
        setSavedOpportunities(new Set(freshUser.savedOpportunities || []));
        setTargetList(freshUser.targetList || {});
        setActiveApplications(freshUser.activeApplications || {});
        setApplicationTracker((freshUser.applicationTracker as Record<string, ApplicationStage>) || {});
      }
    });

    fetchVerifiedOpportunitiesFromFirestore()
      .then((items) => {
        if (items && items.length > 0) {
          const uniqueItems: OpportunityItem[] = [];
          const seenIds = new Set<string>();
          const seenNames = new Set<string>();
          for (const it of items) {
            const normName = it.officialName.toLowerCase().trim();
            if (!seenIds.has(it.id) && !seenNames.has(normName)) {
              seenIds.add(it.id);
              seenNames.add(normName);
              uniqueItems.push(it);
            }
          }
          setOpportunities(uniqueItems);
        }
      })
      .catch((err) => {
        console.info('Live opportunities query fallback to verified registry:', err);
      });
  }, []);

  // Track active Firebase Auth UID so Firestore notification listeners attach cleanly on reload
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUid(fbUser && !fbUser.isAnonymous ? fbUser.uid : null);
      setFirebaseAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time user-isolated notifications in Firestore
  useEffect(() => {
    createdNotificationIdsRef.current.clear();
    if (!activeUser?.id) {
      setNotifications([]);
      setNotificationsLoaded(false);
      return;
    }
    if (!firebaseAuthResolved) {
      return;
    }

    if (firebaseUid === activeUser.id) {
      setNotificationsLoaded(false);
      const unsubscribe = subscribeToUserNotifications(
        activeUser.id,
        (items) => {
          setNotifications((prev) => {
            // Preserve any optimistic notifications created moments before snapshot echoes back
            const byId = new Map<string, StudentNotificationRecord>();
            for (const item of items) {
              byId.set(item.id, item);
              createdNotificationIdsRef.current.add(item.id);
            }
            for (const prevItem of prev) {
              if (!byId.has(prevItem.id) && createdNotificationIdsRef.current.has(prevItem.id)) {
                byId.set(prevItem.id, prevItem);
              }
            }
            return Array.from(byId.values())
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 100);
          });
          setNotificationsLoaded(true);
        },
        () => {
          setNotificationsLoaded(true);
        }
      );
      return () => unsubscribe();
    }

    setNotificationsLoaded(true);
  }, [activeUser?.id, firebaseUid, firebaseAuthResolved]);

  // Run idempotent Smart Notification Engine once notifications & catalog are loaded
  useEffect(() => {
    if (!activeUser?.id || !notificationsLoaded || opportunities.length === 0) {
      return;
    }

    const dismissedIds = loadDismissedNotificationIds(activeUser.id);
    const baseline = loadStoredCatalogBaseline(activeUser.id);

    const generation = generateSmartNotifications({
      user: activeUser,
      opportunities,
      existingNotifications: notifications,
      dismissedIds,
      baseline,
    });

    saveStoredCatalogBaseline(activeUser.id, generation.nextBaseline);

    const freshToPersist = generation.newNotifications.filter(
      (n) => !createdNotificationIdsRef.current.has(n.id)
    );

    if (freshToPersist.length === 0) {
      return;
    }

    for (const item of freshToPersist) {
      createdNotificationIdsRef.current.add(item.id);
    }

    setNotifications((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      const merged = [...freshToPersist.filter((n) => !seen.has(n.id)), ...prev];
      return merged
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 100);
    });

    if (firebaseUid === activeUser.id) {
      void batchCreateUserNotificationsInFirestore(activeUser.id, freshToPersist);
    }
  }, [activeUser, opportunities, notificationsLoaded, firebaseUid, notifications]);

  // Profile Edit Form State (for the My Profile section)
  const userProfile = activeUser?.profile;
  const [profFullName, setProfFullName] = useState(activeUser?.fullName || '');
  const [profPhone, setProfPhone] = useState(userProfile?.phone || '');
  const [profNationality, setProfNationality] = useState(userProfile?.nationality || '');
  const [profResidence, setProfResidence] = useState(userProfile?.countryOfResidence || '');
  const [profCurrentSchool, setProfCurrentSchool] = useState(userProfile?.currentSchool || '');
  const [profEduLevel, setProfEduLevel] = useState(userProfile?.educationLevel || '');
  const [profIntendedDegree, setProfIntendedDegree] = useState(userProfile?.intendedDegree || '');
  const [profFieldOfStudy, setProfFieldOfStudy] = useState(userProfile?.fieldOfStudy || '');
  const [profGraduationYear, setProfGraduationYear] = useState(userProfile?.graduationYear || '');
  const [profDestinations, setProfDestinations] = useState<string[]>(
    userProfile?.preferredDestinations || []
  );
  const [profFundingPreference, setProfFundingPreference] = useState(
    userProfile?.fundingPreference || ''
  );
  const [profTestPreference, setProfTestPreference] = useState(
    userProfile?.testPreference || ''
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveFeedback, setProfileSaveFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Keep form state and list states in sync with active user updates
  useEffect(() => {
    if (activeUser) {
      setProfFullName(activeUser.fullName || '');
      setSavedOpportunities(new Set(activeUser.savedOpportunities || []));
      setTargetList(activeUser.targetList || {});
      if (activeUser.activeApplications) {
        setActiveApplications(activeUser.activeApplications);
      }
      setApplicationTracker((activeUser.applicationTracker as Record<string, ApplicationStage>) || {});

      if (activeUser.profile) {
        setProfPhone(activeUser.profile.phone || '');
        setProfNationality(activeUser.profile.nationality || '');
        setProfResidence(activeUser.profile.countryOfResidence || activeUser.country || '');
        setProfCurrentSchool(activeUser.profile.currentSchool || '');
        setProfEduLevel(activeUser.profile.educationLevel || '');
        setProfIntendedDegree(activeUser.profile.intendedDegree || activeUser.degreeLevel || '');
        setProfFieldOfStudy(activeUser.profile.fieldOfStudy || activeUser.studyField || '');
        setProfGraduationYear(activeUser.profile.graduationYear || '');
        setProfDestinations(activeUser.profile.preferredDestinations || []);
        setProfFundingPreference(activeUser.profile.fundingPreference || '');
        setProfTestPreference(activeUser.profile.testPreference || '');
      }
    }
  }, [activeUser]);

  // Toggle Save Opportunity (Personal Bookmark ONLY — never modifies Target List or Applications)
  const toggleSave = async (opportunityId: string, title: string) => {
    const res = await authService.toggleSavedOpportunitySynced(opportunityId);
    if (!res.success) {
      showNotification(res.error || 'Could not update bookmark. Please check your connection.', true);
      return;
    }

    if (res.user) {
      setActiveUser({ ...res.user });
      setSavedOpportunities(new Set(res.user.savedOpportunities || []));
    }

    if (res.isSaved) {
      showNotification(`Bookmarked "${title}" in Saved Opportunities.`);
    } else {
      showNotification(`Removed "${title}" from Saved Opportunities.`);
    }
  };

  // Upsert Target List Goal
  const handleUpsertTarget = async (input: {
    opportunityId: string;
    priority: TargetPriority;
    intakeYear: string;
    personalGoal: string;
  }) => {
    const res = await authService.upsertTargetListItem(input);
    if (!res.success) {
      showNotification(res.error || 'Could not save Target List item.', true);
      return;
    }
    if (res.user) {
      setActiveUser({ ...res.user });
      setTargetList(res.user.targetList || {});
    }
    showNotification(
      res.persistedToCloud
        ? 'Target List updated and saved.'
        : 'Target List updated for current session.'
    );
  };

  // Remove Target List Goal
  const handleRemoveTarget = async (opportunityId: string, title: string) => {
    const res = await authService.removeTargetListItem(opportunityId);
    if (!res.success) {
      showNotification(res.error || 'Could not remove target.', true);
      return;
    }
    if (res.user) {
      setActiveUser({ ...res.user });
      setTargetList(res.user.targetList || {});
    }
    showNotification(`Removed "${title}" from Target List.`);
  };

  // Start Active Application (requires prior confirmation in UI)
  const handleStartApplication = async (
    opportunityId: string,
    initialStage: ActiveApplicationStage = 'preparing'
  ) => {
    const res = await authService.startActiveApplication(opportunityId, initialStage);
    if (!res.success) {
      showNotification(res.error || 'Could not start application.', true);
      return;
    }
    let latestUser = res.user;
    if (!res.alreadyExists) {
      const matchedOpp = opportunities.find((o) => o.id === opportunityId);
      if (matchedOpp) {
        const snapshot = buildOpportunityRequirementSignature(matchedOpp);
        const snapRes = await authService.updateActiveApplication(opportunityId, {
          requirementSnapshot: snapshot,
        });
        if (snapRes.success && snapRes.user) {
          latestUser = snapRes.user;
        }
      }
    }
    if (latestUser) {
      setActiveUser({ ...latestUser });
      setActiveApplications(latestUser.activeApplications || {});
      setApplicationTracker((latestUser.applicationTracker as Record<string, ApplicationStage>) || {});
    }
    if (res.alreadyExists) {
      showNotification('This opportunity already has an active application.');
    } else {
      showNotification('Application started! Track deadlines and tasks in Applications.');
    }
  };

  // Update Active Application (stage, task checklist, notes, or follow-up reminder date)
  const handleUpdateActiveApplication = async (
    opportunityId: string,
    patch: {
      stage?: ActiveApplicationStage;
      completedTasks?: string[];
      notes?: string;
      followUpDate?: string | null;
      requirementSnapshot?: string;
    }
  ) => {
    const res = await authService.updateActiveApplication(opportunityId, patch);
    if (!res.success) {
      showNotification(res.error || 'Could not update application.', true);
      return;
    }
    if (res.user) {
      setActiveUser({ ...res.user });
      setActiveApplications(res.user.activeApplications || {});
      setApplicationTracker((res.user.applicationTracker as Record<string, ApplicationStage>) || {});
    }
    if (patch.stage) {
      const stageNames: Record<ActiveApplicationStage, string> = {
        preparing: 'Preparing Application',
        submitted: 'Application Submitted',
        accepted: 'Accepted / Enrolled',
      };
      showNotification(`Application status updated to "${stageNames[patch.stage]}".`);
    } else if (patch.followUpDate !== undefined) {
      showNotification(
        patch.followUpDate
          ? 'Follow-up reminder date saved.'
          : 'Follow-up reminder date cleared.'
      );
    }
  };

  // Remove/Withdraw Active Application
  const handleRemoveActiveApplication = async (opportunityId: string, title: string) => {
    const res = await authService.removeActiveApplication(opportunityId);
    if (!res.success) {
      showNotification(res.error || 'Could not remove application.', true);
      return;
    }
    if (res.user) {
      setActiveUser({ ...res.user });
      setActiveApplications(res.user.activeApplications || {});
      setApplicationTracker((res.user.applicationTracker as Record<string, ApplicationStage>) || {});
    }
    showNotification(`Removed "${title}" from active applications.`);
  };

  // In-App Notification Centre actions
  const handleMarkNotificationRead = async (notificationId: string, read: boolean) => {
    const nowIso = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read, updatedAt: nowIso } : n))
    );
    if (activeUser?.id && firebaseUid === activeUser.id) {
      await markUserNotificationReadInFirestore(activeUser.id, notificationId, read);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    const nowIso = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, updatedAt: nowIso })));
    if (activeUser?.id && firebaseUid === activeUser.id) {
      await markAllUserNotificationsReadInFirestore(activeUser.id, unreadIds);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (activeUser?.id) {
      recordDismissedNotificationIds(activeUser.id, [notificationId]);
    }
    createdNotificationIdsRef.current.delete(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    if (activeUser?.id && firebaseUid === activeUser.id) {
      await deleteUserNotificationInFirestore(activeUser.id, notificationId);
      const updatedUser = await authService.recordDismissedNotificationIdsSynced([notificationId]);
      if (updatedUser) {
        setActiveUser({ ...updatedUser });
      }
    }
  };

  const handleClearAllNotifications = async () => {
    const allIds = notifications.map((n) => n.id);
    if (activeUser?.id && allIds.length > 0) {
      recordDismissedNotificationIds(activeUser.id, allIds);
    }
    createdNotificationIdsRef.current.clear();
    setNotifications([]);
    if (activeUser?.id && firebaseUid === activeUser.id) {
      await clearAllUserNotificationsInFirestore(activeUser.id, allIds);
      if (allIds.length > 0) {
        const updatedUser = await authService.recordDismissedNotificationIdsSynced(allIds);
        if (updatedUser) {
          setActiveUser({ ...updatedUser });
        }
      }
    }
  };

  const handleNavigateNotification = (notif: StudentNotificationRecord) => {
    if (!notif.read) {
      void handleMarkNotificationRead(notif.id, true);
    }

    if (notif.actionTab === 'settings' || notif.actionSection === 'notifications') {
      handleOpenNotificationSettings();
      return;
    }

    const matchedOpp = notif.opportunityId
      ? opportunities.find((o) => o.id === notif.opportunityId)
      : undefined;

    if (notif.category === 'application' || notif.actionSection === 'applications') {
      navigateToDashboardView('overview', 'applications');
      return;
    }

    if (notif.actionTab === 'tracker') {
      navigateToDashboardView('tracker', 'home');
      if (matchedOpp) {
        setSelectedOpportunity(matchedOpp);
      }
      return;
    }

    if (matchedOpp) {
      setSelectedOpportunity(matchedOpp);
      return;
    }

    navigateToDashboardView(
      notif.actionTab || 'overview',
      notif.actionSection === 'saved' ? 'saved' : 'home'
    );
  };

  // Legacy / COVA Application Tracker Stage callback
  const updateAppStatus = async (
    opportunityId: string,
    status: ApplicationStage
  ) => {
    if (status === 'preparing' || status === 'submitted' || status === 'accepted') {
      await handleUpdateActiveApplication(opportunityId, { stage: status });
      return;
    }
    const updatedUser = authService.updateApplicationStatus(opportunityId, status);
    if (updatedUser) {
      setActiveUser({ ...updatedUser });
      setApplicationTracker((updatedUser.applicationTracker as Record<string, ApplicationStage>) || {});
    }
  };

  // Save updated profile preferences (honest persistence verification)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveFeedback(null);

    try {
      const fundingTypeMap: Record<string, string> = {
        'Fully Funded Only': 'fully_funded',
        'Partial & Merit Scholarships': 'partially_funded',
        'Self-Funded / Standard Tuition': 'self_funded',
        'All Funding Types': 'all',
      };

      const res = await authService.saveDashboardProfile({
        fullName: profFullName,
        profileData: {
          phone: profPhone.trim(),
          nationality: profNationality.trim(),
          countryOfResidence: profResidence.trim(),
          currentSchool: profCurrentSchool.trim(),
          educationLevel: profEduLevel.trim(),
          graduationYear: profGraduationYear.trim(),
          intendedDegree: profIntendedDegree.trim(),
          fieldOfStudy: profFieldOfStudy.trim(),
          preferredDestinations: profDestinations,
          fundingPreference: profFundingPreference.trim(),
          ...(fundingTypeMap[profFundingPreference]
            ? { fundingTypePreference: fundingTypeMap[profFundingPreference] }
            : {}),
          testPreference: profTestPreference.trim(),
        },
      });

      if (!res.success || !res.user) {
        const errMsg = res.error || 'Failed to save profile changes. Please try again.';
        setProfileSaveFeedback({ type: 'error', text: errMsg });
        showNotification(errMsg, true);
        return;
      }

      setActiveUser({ ...res.user });
      if (profResidence.trim()) {
        setSelectedUserCountry(profResidence.trim());
      }

      if (res.persistedToCloud) {
        const msg = 'Personal, academic, and study details saved to your account.';
        setProfileSaveFeedback({ type: 'success', text: msg });
        showNotification(msg);
      } else {
        const msg =
          'Profile updated locally, but cloud persistence could not be confirmed. Please sign in again to sync to your account.';
        setProfileSaveFeedback({ type: 'info', text: msg });
        showNotification(msg);
      }
    } catch {
      const errMsg = 'Unexpected error saving profile changes.';
      setProfileSaveFeedback({ type: 'error', text: errMsg });
      showNotification(errMsg, true);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleManualDbSync = async () => {
    setDbState((prev) => ({ ...prev, isSyncing: true }));
    try {
      const isAdmin = await checkCurrentUserIsAdmin(true);
      if (!isAdmin) {
        showNotification(
          'Administrator privileges (verified Firebase custom claim) are required to edit directory records.',
          true
        );
        return;
      }
      const count = await seedVerifiedOpportunitiesToFirestore();
      showNotification(`University directory updated with ${count} verified institutions.`);
      const live = await fetchVerifiedOpportunitiesFromFirestore();
      if (live && live.length > 0) {
        setOpportunities(live);
      }
    } catch (err: any) {
      showNotification(
        err?.message || 'Permission denied: administrator privileges are required to modify university records.',
        true
      );
    } finally {
      setDbState((prev) => ({ ...prev, isSyncing: false }));
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDestination('');
    setSelectedNationality('all');
    setSelectedLevel('all');
    setSelectedField('all');
    setSelectedFunding('all');
    setSelectedAppFee('all');
    setSelectedTestPolicy('all');
    setSelectedInstitutionType('all');
    setSelectedDeadlineStatus('all');
    setCurrentPage(1);
    showNotification('All search and filter criteria reset.');
  };

  // Filter opportunities based on activeSection & search filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      if (!item) return false;

      const fundingType = item.funding?.type || item.fundingDetails?.type || '';
      const appFeeStatus = item.applicationFee?.status || item.applicationFees?.status || '';
      const testObj = item.testPolicy || item.testWaiverRules;
      const testStatus = testObj?.status || '';

      // 1. Navigation Section Filter
      if (activeTab === 'scholarships') {
        if (
          item.category !== 'scholarship' &&
          fundingType !== 'Fully Funded' &&
          fundingType !== '100% Need-Met'
        ) {
          return false;
        }
      }

      // 2. Study Destination filter
      if (selectedDestination && !selectedDestination.toLowerCase().includes('all destination')) {
        const countryName = (item.country || '').toLowerCase();
        const dest = selectedDestination.toLowerCase();
        const matchesCountry = countryName === dest || countryName.includes(dest);
        if (!matchesCountry) return false;
      }

      // 3. Nationality Eligibility filter (respect verified data; never exclude on missing eligibility info)
      if (selectedNationality !== 'all') {
        const natCat = item.nationalityEligibility?.category || '';
        const regions = item.nationalityEligibility?.eligibleRegions || [];
        const hasEligibilityData = Boolean(natCat) || regions.length > 0;

        if (hasEligibilityData) {
          if (selectedNationality === 'ghanaian') {
            const isEligible =
              regions.some((r) => r.toLowerCase().includes('ghana')) ||
              natCat === 'Ghanaian Citizens' ||
              natCat === 'African Citizens' ||
              natCat === 'All Nationalities' ||
              natCat === 'All International Citizens';
            if (!isEligible) return false;
          } else if (selectedNationality === 'african') {
            const isEligible =
              natCat === 'African Citizens' ||
              natCat === 'All Nationalities' ||
              natCat === 'All International Citizens' ||
              regions.some(
                (r) => r.toLowerCase().includes('africa') || r.toLowerCase().includes('ghana')
              );
            if (!isEligible) return false;
          } else if (selectedNationality === 'international') {
            const isEligible =
              natCat === 'All International Citizens' ||
              natCat === 'All Nationalities';
            if (!isEligible) return false;
          }
        }
      }

      // 4. Degree Level filter
      if (selectedLevel !== 'all') {
        const levels = item.degreeLevels || [];
        const hasLevel = levels.some((lvl) => {
          const l = lvl.toLowerCase();
          if (selectedLevel === 'undergraduate') {
            return l.includes('undergrad') || l.includes('bachelor');
          }
          if (selectedLevel === 'master') {
            return l.includes('master') || l.includes('postgrad');
          }
          if (selectedLevel === 'phd') {
            return l.includes('phd') || l.includes('doctor');
          }
          return l.includes(selectedLevel.toLowerCase());
        });
        if (!hasLevel) return false;
      }

      // 5. Field of Study filter
      if (selectedField !== 'all') {
        const fields = item.studyFields || [];
        if (selectedField === 'cs-tech') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return (
              l.includes('computer') ||
              l.includes('software') ||
              l.includes('data') ||
              l.includes('artificial intelligence') ||
              l.includes('informatics') ||
              l.includes('information tech') ||
              l.includes('cyber') ||
              /\bai\b/.test(l)
            );
          });
          if (!matches) return false;
        } else if (selectedField === 'engineering') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return (
              l.includes('engineer') ||
              l.includes('architect') ||
              l.includes('robotics') ||
              l.includes('mechatronic')
            );
          });
          if (!matches) return false;
        } else if (selectedField === 'business') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return (
              l.includes('business') ||
              l.includes('economic') ||
              l.includes('management') ||
              l.includes('finance') ||
              l.includes('account') ||
              l.includes('marketing')
            );
          });
          if (!matches) return false;
        } else if (selectedField === 'health') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return (
              l.includes('health') ||
              l.includes('medicine') ||
              l.includes('medical') ||
              l.includes('nursing') ||
              l.includes('pharmacy') ||
              l.includes('biomed') ||
              l.includes('dentistry')
            );
          });
          if (!matches) return false;
        } else if (selectedField === 'law') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return (
              l.includes('law') ||
              l.includes('legal') ||
              l.includes('international relations') ||
              l.includes('public policy') ||
              l.includes('diplomacy')
            );
          });
          if (!matches) return false;
        } else if (selectedField === 'education') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return (
              l.includes('education') ||
              l.includes('teaching') ||
              l.includes('social science') ||
              l.includes('sociology') ||
              l.includes('psychology') ||
              l.includes('humanities')
            );
          });
          if (!matches) return false;
        }
      }

      // 6. Funding Type filter
      if (selectedFunding !== 'all') {
        const ft = fundingType.toLowerCase();
        if (selectedFunding === 'fully-funded') {
          if (ft !== 'fully funded') return false;
        } else if (selectedFunding === 'need-met') {
          if (ft !== '100% need-met') return false;
        } else if (selectedFunding === 'tuition-free') {
          if (!ft.includes('tuition-free') && !ft.includes('tuition waiver')) return false;
        } else if (selectedFunding === 'merit-aid') {
          if (!ft.includes('partial') && !ft.includes('merit') && !ft.includes('government')) {
            return false;
          }
        }
      }

      // 7. Application Fee filter
      if (selectedAppFee !== 'all') {
        if (selectedAppFee === 'free') {
          if (appFeeStatus !== 'Free ($0 Fee)') return false;
        } else if (selectedAppFee === 'waiver') {
          if (appFeeStatus !== 'Fee Waiver Available') return false;
        } else if (selectedAppFee === 'free-or-waiver') {
          if (appFeeStatus !== 'Free ($0 Fee)' && appFeeStatus !== 'Fee Waiver Available') {
            return false;
          }
        }
      }

      // 8. SAT / Test Policy filter
      if (selectedTestPolicy !== 'all') {
        if (selectedTestPolicy === 'test-optional') {
          const statusLower = testStatus.toLowerCase();
          if (statusLower === 'test required') return false;
          const combined = `${testStatus} ${testObj?.satPolicy || ''} ${testObj?.details || ''}`.toLowerCase();
          const isSatFreeOrOptional =
            combined.includes('test-free') ||
            combined.includes('test-optional') ||
            combined.includes('not required') ||
            combined.includes('no sat') ||
            combined.includes('sat optional') ||
            combined.includes('sat-optional') ||
            combined.includes('sat-free');
          if (!isSatFreeOrOptional) return false;
        } else if (selectedTestPolicy === 'waec-accepted') {
          const combined = `${testStatus} ${testObj?.englishProficiencyPolicy || ''} ${testObj?.wassceExemptionDetails || ''} ${testObj?.details || ''}`.toLowerCase();
          if (!combined.includes('waec') && !combined.includes('wassce')) return false;
        }
      }

      // 9. Institution Type filter
      if (selectedInstitutionType !== 'all') {
        if (item.institutionType !== selectedInstitutionType) return false;
      }

      // 10. Intake / Deadline Status filter
      if (selectedDeadlineStatus !== 'all') {
        const deadlineEval = evaluateOpportunityDeadline(item.deadlines);
        if (selectedDeadlineStatus === 'open' && deadlineEval.status !== 'open') return false;
        if (selectedDeadlineStatus === 'rolling' && deadlineEval.status !== 'rolling') return false;
        if (selectedDeadlineStatus === 'open-or-rolling' && deadlineEval.status === 'expired') {
          return false;
        }
      }

      // 11. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = (item.title || '').toLowerCase().includes(q);
        const matchesInstitution =
          (item.institution || '').toLowerCase().includes(q) ||
          (item.officialName || '').toLowerCase().includes(q);
        const matchesCountry =
          (item.country || '').toLowerCase().includes(q) ||
          (item.countryCode || '').toLowerCase().includes(q);
        const matchesCity = (item.city || '').toLowerCase().includes(q);
        const matchesFields = (item.studyFields || []).some((f) => f.toLowerCase().includes(q));
        if (!matchesTitle && !matchesInstitution && !matchesCountry && !matchesCity && !matchesFields) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeTab,
    selectedDestination,
    selectedNationality,
    selectedLevel,
    selectedField,
    selectedFunding,
    selectedAppFee,
    selectedTestPolicy,
    selectedInstitutionType,
    selectedDeadlineStatus,
    searchQuery,
    opportunities,
  ]);

  // Sort and prioritize opportunities
  const prioritizedOpportunities = useMemo(() => {
    const list = [...filteredOpportunities];

    if (sortBy === 'name-asc') {
      return list.sort((a, b) => (a.officialName || '').localeCompare(b.officialName || ''));
    }
    if (sortBy === 'free-fee') {
      return list.sort((a, b) => {
        const aFee = a.applicationFee?.status || a.applicationFees?.status || '';
        const bFee = b.applicationFee?.status || b.applicationFees?.status || '';
        const aFree = aFee === 'Free ($0 Fee)';
        const bFree = bFee === 'Free ($0 Fee)';
        if (aFree && !bFree) return -1;
        if (!aFree && bFree) return 1;
        return (a.officialName || '').localeCompare(b.officialName || '');
      });
    }
    if (sortBy === 'funded') {
      return list.sort((a, b) => {
        const aType = a.funding?.type || a.fundingDetails?.type || '';
        const bType = b.funding?.type || b.fundingDetails?.type || '';
        const aFund = aType === 'Fully Funded' || aType === '100% Need-Met';
        const bFund = bType === 'Fully Funded' || bType === '100% Need-Met';
        if (aFund && !bFund) return -1;
        if (!aFund && bFund) return 1;
        return (a.officialName || '').localeCompare(b.officialName || '');
      });
    }

    // Default 'relevant': Student's saved country appears first when set, followed by global verified institutions
    return sortRelevantExploreOpportunities(
      list,
      selectedUserCountry,
      selectedDestination
    );
  }, [filteredOpportunities, sortBy, selectedUserCountry, selectedDestination]);

  // Contextual Featured University Banner (shown only on country filter or specific university/country search)
  const exploreBanner = useMemo(() => {
    return resolveExploreBannerOpportunity({
      opportunities,
      filteredOpportunities: prioritizedOpportunities,
      selectedDestination,
      searchQuery,
      isScholarshipsTab: activeTab === 'scholarships',
    });
  }, [opportunities, prioritizedOpportunities, selectedDestination, searchQuery, activeTab]);

  // Total items and pagination (6 cards per page)
  const totalItems = prioritizedOpportunities.length;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  const paginatedOpportunities = useMemo(() => {
    if (pageSize <= 0) return prioritizedOpportunities;
    const start = (currentPage - 1) * pageSize;
    return prioritizedOpportunities.slice(start, start + pageSize);
  }, [prioritizedOpportunities, currentPage, pageSize]);

  const paginationTokens = useMemo<(number | 'ellipsis')[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [
        1,
        'ellipsis',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }, [currentPage, totalPages]);

  // Saved Items List for Saved Opportunities View
  const savedItemsList = useMemo(() => {
    return opportunities.filter((item) => savedOpportunities.has(item.id));
  }, [opportunities, savedOpportunities]);

  // Real Profile Completion & Missing Information (Personal, Academic, Study Preferences)
  const profileCompletion = useMemo(() => {
    const p = activeUser?.profile;
    const checks: { id: string; label: string; category: string; completed: boolean }[] = [
      {
        id: 'prof-fullname',
        label: 'Full Legal Name',
        category: 'Personal',
        completed: Boolean(activeUser?.fullName && activeUser.fullName.trim().length >= 2),
      },
      {
        id: 'prof-phone',
        label: 'Phone / WhatsApp Number',
        category: 'Personal',
        completed: Boolean(p?.phone && p.phone.trim().length >= 5),
      },
      {
        id: 'prof-nationality',
        label: 'Nationality / Citizenship',
        category: 'Personal',
        completed: Boolean(p?.nationality && p.nationality.trim().length > 0),
      },
      {
        id: 'prof-residence',
        label: 'Country of Residence',
        category: 'Personal',
        completed: Boolean((p?.countryOfResidence || activeUser?.country || '').trim().length > 0),
      },
      {
        id: 'prof-school',
        label: 'Current / Previous School',
        category: 'Academic',
        completed: Boolean(p?.currentSchool && p.currentSchool.trim().length > 1),
      },
      {
        id: 'prof-edu-level',
        label: 'Current Education Level',
        category: 'Academic',
        completed: Boolean(p?.educationLevel && p.educationLevel.trim().length > 0),
      },
      {
        id: 'prof-grad-year',
        label: 'Graduation Year',
        category: 'Academic',
        completed: Boolean(p?.graduationYear && p.graduationYear.trim().length > 0),
      },
      {
        id: 'prof-intended-degree',
        label: 'Intended Degree Level',
        category: 'Study Preferences',
        completed: Boolean((p?.intendedDegree || activeUser?.degreeLevel || '').trim().length > 0),
      },
      {
        id: 'prof-field',
        label: 'Field of Study',
        category: 'Study Preferences',
        completed: Boolean((p?.fieldOfStudy || activeUser?.studyField || '').trim().length > 0),
      },
      {
        id: 'prof-destinations',
        label: 'Preferred Study Destinations',
        category: 'Study Preferences',
        completed: Boolean(p?.preferredDestinations && p.preferredDestinations.length > 0),
      },
      {
        id: 'prof-funding',
        label: 'Funding Preference',
        category: 'Study Preferences',
        completed: Boolean(
          (p?.fundingPreference && p.fundingPreference.trim().length > 0) ||
            (p?.fundingTypePreference && p.fundingTypePreference.trim().length > 0)
        ),
      },
      {
        id: 'prof-test',
        label: 'Standardized Test Preference',
        category: 'Study Preferences',
        completed: Boolean(p?.testPreference && p.testPreference.trim().length > 0),
      },
    ];

    const completedCount = checks.filter((c) => c.completed).length;
    const missingFields = checks.filter((c) => !c.completed);
    const percentage = Math.round((completedCount / checks.length) * 100);

    return {
      percentage,
      completedCount,
      totalCount: checks.length,
      missingFields,
    };
  }, [activeUser]);

  // Real Counts for Badges & 4 Stat Cards (strictly separated, no hardcoded fake fallbacks)
  const counts = useMemo(() => {
    const scCount = opportunities.filter((i) => {
      if (!i) return false;
      const fType = i.funding?.type || i.fundingDetails?.type || '';
      return i.category === 'scholarship' || fType === 'Fully Funded' || fType === '100% Need-Met';
    }).length;
    const uniCount = opportunities.length;

    const opportunityIds = new Set(opportunities.map((o) => o.id));
    const activeAppItems = Object.values(activeApplications).filter(
      (a) =>
        (a.stage === 'preparing' || a.stage === 'submitted' || a.stage === 'accepted') &&
        (opportunityIds.size === 0 || opportunityIds.has(a.opportunityId))
    );
    const targetItems = Object.values(targetList).filter(
      (t) => opportunityIds.size === 0 || opportunityIds.has(t.opportunityId)
    );

    const savedUnis = savedItemsList.filter((i) => i.category !== 'scholarship').length;
    const savedScholarships = savedItemsList.filter((i) => {
      const fType = i.funding?.type || i.fundingDetails?.type || '';
      return i.category === 'scholarship' || fType === 'Fully Funded' || fType === '100% Need-Met';
    }).length;

    const preparingApps = activeAppItems.filter((a) => a.stage === 'preparing').length;
    const submittedApps = activeAppItems.filter((a) => a.stage === 'submitted').length;
    const acceptedApps = activeAppItems.filter((a) => a.stage === 'accepted').length;

    const highPriorityTargets = targetItems.filter((t) => t.priority === 'High').length;

    return {
      universities: uniCount,
      scholarships: scCount,
      saved: savedItemsList.length,
      savedUnis,
      savedScholarships,
      applications: activeAppItems.length,
      preparingApps,
      submittedApps,
      acceptedApps,
      targets: targetItems.length,
      highPriorityTargets,
    };
  }, [savedItemsList, opportunities, activeApplications, targetList]);

  // Recommended Verified Matches for Dashboard: Prioritizes student's nationality, destinations, field, degree, funding, and test policy
  const recommendedUniversities = useMemo(() => {
    const destinations =
      activeUser?.profile?.preferredDestinations && activeUser.profile.preferredDestinations.length > 0
        ? activeUser.profile.preferredDestinations
        : [selectedUserCountry].filter(Boolean);

    const nationality = (activeUser?.profile?.nationality || selectedUserCountry || '').toLowerCase().trim();
    const targetDegree = (activeUser?.profile?.intendedDegree || activeUser?.degreeLevel || '').toLowerCase();
    const primaryField = (activeUser?.profile?.fieldOfStudy || activeUser?.studyField || '').toLowerCase();
    const targetFields = (activeUser?.profile?.preferredFieldsOfStudy || (primaryField ? [primaryField] : [])).map((f) =>
      f.toLowerCase()
    );
    const fundingPref = (
      activeUser?.profile?.fundingPreference ||
      activeUser?.profile?.fundingTypePreference ||
      ''
    ).toLowerCase();
    const testPref = (activeUser?.profile?.testPreference || '').toLowerCase();

    const scoreOpportunity = (opp: OpportunityItem): number => {
      if (!opp.isVerified) return 0;

      // Exclude expired opportunities from active personalized recommendations
      const deadlineEval = evaluateOpportunityDeadline(opp.deadlines);
      if (deadlineEval.isExpired) return 0;

      let score = 0;

      // Preferred study destinations & residence matching
      if (destinations.some((dest) => isCountryMatch(opp, dest))) {
        score += 45;
      } else if (selectedUserCountry && isCountryMatch(opp, selectedUserCountry)) {
        score += 30;
      }

      // Nationality / region eligibility alignment
      if (nationality) {
        const natCat = (opp.nationalityEligibility?.category || '').toLowerCase();
        const regions = (opp.nationalityEligibility?.eligibleRegions || []).map((r) => r.toLowerCase());
        const isGlobal =
          natCat.includes('all nationalities') ||
          natCat.includes('all international') ||
          regions.some((r) => r.includes('global') || r.includes('worldwide') || r.includes('all'));
        const isDirectNationality =
          regions.some((r) => r.includes(nationality) || nationality.includes(r)) ||
          natCat.includes(nationality);
        const isAfricanStudent =
          ['ghana', 'nigeria', 'kenya', 'south africa', 'egypt', 'ethiopia', 'rwanda', 'uganda', 'tanzania', 'morocco', 'senegal', 'cameroon'].some((c) =>
            nationality.includes(c)
          ) &&
          (natCat.includes('african') || regions.some((r) => r.includes('africa')));

        if (isDirectNationality) score += 20;
        else if (isAfricanStudent || isGlobal) score += 12;
      }

      // Field of study matching
      if (targetFields.length > 0 && opp.studyFields && opp.studyFields.length > 0) {
        const matchesField = opp.studyFields.some((f) => {
          const lowerF = f.toLowerCase();
          return (
            lowerF.includes('all fields') ||
            targetFields.some((tf) => tf && (lowerF.includes(tf) || tf.includes(lowerF))) ||
            (primaryField && (lowerF.includes(primaryField) || primaryField.includes(lowerF)))
          );
        });
        if (matchesField) score += 25;
      }

      // Degree level matching
      if (targetDegree && opp.degreeLevels && opp.degreeLevels.length > 0) {
        const isUndergrad = targetDegree.includes('undergrad') || targetDegree.includes('bachelor');
        const isPostgrad = targetDegree.includes('master') || targetDegree.includes('postgrad');
        const isDoctorate = targetDegree.includes('phd') || targetDegree.includes('doctor');

        const matchesDegree = opp.degreeLevels.some((lvl) => {
          const lowerL = lvl.toLowerCase();
          if (isUndergrad && (lowerL.includes('undergrad') || lowerL.includes('bachelor'))) return true;
          if (isPostgrad && (lowerL.includes('master') || lowerL.includes('postgrad'))) return true;
          if (isDoctorate && (lowerL.includes('phd') || lowerL.includes('doctor'))) return true;
          return lowerL.includes(targetDegree);
        });
        if (matchesDegree) score += 20;
      }

      // Funding preference matching
      if (fundingPref) {
        const fType = (opp.funding?.type || opp.fundingDetails?.type || '').toLowerCase();
        if (
          (fundingPref.includes('fully') || fundingPref.includes('need')) &&
          (fType.includes('fully') || fType.includes('100% need-met'))
        ) {
          score += 15;
        } else if (
          (fundingPref.includes('partial') || fundingPref.includes('merit') || fundingPref.includes('waiver')) &&
          (fType.includes('partial') || fType.includes('merit') || fType.includes('waiver'))
        ) {
          score += 15;
        }
      }

      // Admissions requirements / Standardized test policy matching
      if (testPref) {
        const testStatus = (opp.testPolicy?.status || opp.testWaiverRules?.status || '').toLowerCase();
        const wassceDetails = (opp.testPolicy?.wassceExemptionDetails || opp.testWaiverRules?.wassceExemptionDetails || '').toLowerCase();
        const engPolicy = (opp.testPolicy?.englishProficiencyPolicy || opp.testWaiverRules?.englishProficiencyPolicy || '').toLowerCase();

        if (
          (testPref.includes('optional') || testPref.includes('no test') || testPref.includes('waiv')) &&
          (testStatus.includes('optional') || testStatus.includes('test-free') || testStatus.includes('waec'))
        ) {
          score += 10;
        } else if (
          (testPref.includes('waec') || testPref.includes('wassce')) &&
          (testStatus.includes('waec') || wassceDetails.includes('wassce') || engPolicy.includes('wassce'))
        ) {
          score += 12;
        }
      }

      // Open/confirmed cycle bonus (only boosts already-matching candidates)
      if (score > 0 && deadlineEval.isOpen) {
        score += 5;
      }

      return score;
    };

    const verifiedList = opportunities.filter((opp) => opp && opp.isVerified);
    const scored = verifiedList
      .map((opp) => ({ opp, score: scoreOpportunity(opp) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 6).map((s) => s.opp);
  }, [opportunities, selectedUserCountry, activeUser]);

  const activeFiltersCount = [
    searchQuery,
    selectedDestination,
    selectedNationality !== 'all',
    selectedLevel !== 'all',
    selectedField !== 'all',
    selectedFunding !== 'all',
    selectedAppFee !== 'all',
    selectedTestPolicy !== 'all',
    selectedInstitutionType !== 'all',
    selectedDeadlineStatus !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#15152F] flex flex-col selection:bg-[#6846F5] selection:text-white">
      {/* 1. Left Responsive Sidebar matching mockup screens 4 & 5 */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          navigateToDashboardView(tab, 'home');
        }}
        onLogout={onLogout || (() => {})}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        counts={{
          universities: counts.universities,
          scholarships: counts.scholarships,
          saved: counts.saved,
        }}
      />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border animate-in fade-in slide-in-from-bottom-2 duration-150 ${
            toastMessage.isError
              ? 'bg-rose-700 border-rose-500'
              : 'bg-[#10132D] border-[#25254D]'
          }`}
        >
          {toastMessage.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#E7B75C] shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 2. Main Dashboard Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar: Mobile Brand Header (<640px) & Tablet/Desktop Header (>=640px) */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3 shadow-xs">
          {/* Left: Hamburger + Mobile Logo (<sm) or Desktop Breadcrumb (>=sm) */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] -ml-1 sm:ml-0 sm:w-auto sm:h-auto sm:min-w-0 sm:min-h-0 sm:px-2.5 sm:py-2 rounded-xl sm:border sm:border-slate-200 text-slate-700 hover:text-[#10132D] hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-[#10132D] sm:text-slate-700" />
              <span className="hidden sm:inline text-xs font-semibold text-slate-700">Menu</span>
            </button>

            {/* Mobile Header Brand Lockup (Clickable to Dashboard) */}
            <div className="sm:hidden min-w-0 flex-1 overflow-hidden">
              <button
                type="button"
                onClick={() => navigateToDashboardView('overview', 'home')}
                aria-label="Go to Campus Connect Dashboard"
                className="min-w-0 max-w-full inline-flex items-center text-left rounded-xl py-0.5 pr-1 transition-opacity duration-150 hover:opacity-85 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
              >
                <Logo size="sm" variant="light" iconShape="circle" showWordmark={true} />
              </button>
            </div>

            {/* Tablet & Desktop Breadcrumb Title (Unchanged) */}
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6846F5] shrink-0">
                Student Portal
              </span>
              <span className="text-slate-300 shrink-0">/</span>
              <h1 className="text-sm sm:text-base font-bold text-[#10132D] capitalize truncate">
                {activeTab === 'overview' && overviewSection === 'saved'
                  ? 'Saved Opportunities'
                  : activeTab === 'overview' && overviewSection === 'applications'
                  ? 'Applications'
                  : activeTab === 'overview'
                  ? 'Dashboard Overview'
                  : activeTab === 'universities'
                  ? 'Explore Universities'
                  : activeTab === 'scholarships'
                  ? 'Scholarships & Grants'
                  : activeTab === 'tracker'
                  ? 'Target List'
                  : activeTab === 'profile'
                  ? 'My Profile'
                  : activeTab === 'resources'
                  ? 'Academic Resources'
                  : 'Settings'}
              </h1>
            </div>
          </div>

          {/* Right: Notification Bell Centre, View Landing & User Avatar Badge */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                <span>View Landing Page</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            <NotificationBellCenter
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onDeleteNotification={handleDeleteNotification}
              onClearAllNotifications={handleClearAllNotifications}
              onNavigateNotification={handleNavigateNotification}
              onOpenNotificationSettings={handleOpenNotificationSettings}
            />

            {/* Student Profile Badge (Initials Circle on Mobile, Pill with Name on Tablet/Desktop) */}
            <button
              type="button"
              onClick={() => navigateToDashboardView('profile', 'home')}
              title="Open My Profile"
              aria-label="Open My Profile"
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center sm:gap-2.5 sm:p-1 sm:pr-3 rounded-full sm:bg-slate-50 sm:hover:bg-slate-100 sm:border sm:border-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
            >
              <StudentInitialsAvatar
                fullName={activeUser?.fullName}
                email={activeUser?.email}
                size="md"
                className="w-9 h-9 sm:w-8 sm:h-8 text-xs"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#10132D] leading-tight truncate max-w-[130px]">
                  {activeUser?.fullName || activeUser?.email?.split('@')[0] || 'Student'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none">Student</p>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-36 sm:pb-24">
          {/* ========================================================================= */}
          {/* VIEW A: DASHBOARD OVERVIEW & CARD SUB-DESTINATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && overviewSection === 'saved' && (
            <SavedOpportunitiesView
              savedItems={savedItemsList}
              targetList={targetList}
              onRemoveBookmark={toggleSave}
              onAddToTargetList={handleUpsertTarget}
              onOpenDetails={setSelectedOpportunity}
              onExploreDirectory={(tab) => navigateToDashboardView(tab, 'home')}
              onBack={handleBackToOverview}
              initialFilter={savedFilterState.filter}
              filterNonce={savedFilterState.nonce}
            />
          )}

          {activeTab === 'overview' && overviewSection === 'applications' && (
            <ApplicationsView
              opportunities={opportunities}
              activeApplications={activeApplications}
              targetList={targetList}
              onUpdateApplication={handleUpdateActiveApplication}
              onStartApplication={handleStartApplication}
              onRemoveApplication={handleRemoveActiveApplication}
              onOpenDetails={setSelectedOpportunity}
              onOpenTargetList={() => navigateToDashboardView('tracker', 'home')}
              onExploreDirectory={() => navigateToDashboardView('universities', 'home')}
              onBack={handleBackToOverview}
              initialStageFilter={appViewState.filter}
              filterNonce={appViewState.filterNonce}
              openStartPickerNonce={appViewState.openStartPickerNonce}
            />
          )}

          {activeTab === 'overview' && overviewSection === 'home' && (
            <>
              {/* Mobile Student Dashboard Redesign (< 640px) */}
              <div className="sm:hidden">
                <MobileDashboardOverview
                  firstName={activeUser?.fullName?.trim().split(/\s+/)[0] || activeUser?.email?.split('@')[0] || 'Scholar'}
                  profileCompletion={profileCompletion}
                  opportunities={opportunities}
                  recommendedOpportunities={recommendedUniversities.slice(0, 3)}
                  savedOpportunities={savedOpportunities}
                  savedItemsList={savedItemsList}
                  activeApplications={activeApplications}
                  targetList={targetList}
                  onNavigate={navigateToDashboardView}
                  onToggleSave={toggleSave}
                  onOpenOpportunity={setSelectedOpportunity}
                />
              </div>

              {/* Tablet & Desktop Dashboard Overview (>= 640px) */}
              <div className="hidden sm:block">
                <DesktopDashboardOverview
                  activeUser={activeUser}
                  profileCompletion={profileCompletion}
                  counts={counts}
                  opportunities={opportunities}
                  recommendedMatches={recommendedUniversities}
                  savedOpportunities={savedOpportunities}
                  activeApplications={activeApplications}
                  targetList={targetList}
                  onNavigate={navigateToDashboardView}
                  onOpenSavedFiltered={handleOpenSavedFiltered}
                  onOpenApplicationsFiltered={handleOpenApplicationsFiltered}
                  onToggleSave={toggleSave}
                  onOpenOpportunity={setSelectedOpportunity}
                  onUpdateApplication={handleUpdateActiveApplication}
                  onOpenNotificationSettings={handleOpenNotificationSettings}
                />
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW B: EXPLORE UNIVERSITIES & SCHOLARSHIPS */}
          {/* ========================================================================= */}
          {(activeTab === 'universities' || activeTab === 'scholarships') && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
              {/* Contextual Featured University Banner (above heading on country filter / specific search) */}
              {activeTab === 'universities' && exploreBanner && (
                <FeaturedUniversityBanner
                  item={exploreBanner.opportunity}
                  onOpenDetails={setSelectedOpportunity}
                />
              )}

              {/* Header Title & Dynamic Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#10132D] tracking-tight leading-tight">
                  {activeTab === 'universities' ? 'Explore Universities' : 'Scholarships & Funding'}
                </h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  {activeTab === 'scholarships'
                    ? `Discover ${totalItems} verified full-ride, tuition waivers, and bilateral scholarships.`
                    : exploreBanner?.mode === 'country' && exploreBanner.countryLabel
                    ? `Universities in ${exploreBanner.countryLabel} (${totalItems} verified ${totalItems === 1 ? 'institution' : 'institutions'})`
                    : `Find your dream university from ${totalItems} verified institutions worldwide.`}
                </p>
              </div>

              {/* Search Bar & Compact 3-Button Filter Bar */}
              <UniversitySearchFilters
                searchQuery={searchQuery}
                onSearchQueryChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                selectedDestination={selectedDestination}
                onDestinationChange={(val) => {
                  setSelectedDestination(val);
                  setCurrentPage(1);
                }}
                selectedLevel={selectedLevel}
                onLevelChange={(val) => {
                  setSelectedLevel(val);
                  setCurrentPage(1);
                }}
                selectedField={selectedField}
                onFieldChange={(val) => {
                  setSelectedField(val);
                  setCurrentPage(1);
                }}
                selectedInstitutionType={selectedInstitutionType}
                onInstitutionTypeChange={(val) => {
                  setSelectedInstitutionType(val);
                  setCurrentPage(1);
                }}
                selectedTestPolicy={selectedTestPolicy}
                onTestPolicyChange={(val) => {
                  setSelectedTestPolicy(val);
                  setCurrentPage(1);
                }}
                selectedAppFee={selectedAppFee}
                onAppFeeChange={(val) => {
                  setSelectedAppFee(val);
                  setCurrentPage(1);
                }}
                selectedFunding={selectedFunding}
                onFundingChange={(val) => {
                  setSelectedFunding(val);
                  setCurrentPage(1);
                }}
                selectedDeadlineStatus={selectedDeadlineStatus}
                onDeadlineStatusChange={(val) => {
                  setSelectedDeadlineStatus(val);
                  setCurrentPage(1);
                }}
                showAdvancedFilters={showAdvancedFilters}
                onToggleAdvancedFilters={() => setShowAdvancedFilters((prev) => !prev)}
                onResetAll={resetAllFilters}
                onSearchSubmit={() => setCurrentPage(1)}
                isScholarshipsTab={activeTab === 'scholarships'}
              />

              {/* Compact Results Count & Sort By Bar */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="text-xs sm:text-sm font-bold text-[#10132D] tabular-nums">
                  {totalItems}{' '}
                  {activeTab === 'scholarships'
                    ? totalItems === 1
                      ? 'scholarship found'
                      : 'scholarships found'
                    : totalItems === 1
                    ? 'university found'
                    : 'universities found'}
                </p>

                <div className="flex items-center gap-1.5 text-xs shrink-0">
                  <span className="text-slate-500">Sort by:</span>
                  <select
                    value={sortBy}
                    aria-label="Sort universities"
                    onChange={(e) => {
                      setSortBy(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="h-8 sm:h-9 px-2.5 text-xs font-semibold bg-white border border-[#E2E8F0] rounded-xl text-[#10132D] focus:outline-none focus:border-[#6846F5] cursor-pointer"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="free-fee">Free Application Fee First</option>
                    <option value="funded">Full Funding First</option>
                  </select>
                </div>
              </div>

              {/* Compact University Cards List (6 per page) */}
              {paginatedOpportunities.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-[#10132D]">
                    {activeTab === 'scholarships'
                      ? 'No matching scholarships found'
                      : 'No matching universities found'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting or resetting your filters, or search for a university, city, or country.
                  </p>
                  <Button variant="outline" size="sm" onClick={resetAllFilters}>
                    Reset Search &amp; Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
                  {paginatedOpportunities.map((item) => (
                    <UniversityCard
                      key={item.id}
                      item={item}
                      variant="list"
                      showFundingSummary={activeTab === 'scholarships'}
                      isSaved={savedOpportunities.has(item.id)}
                      onToggleSave={toggleSave}
                      onOpenDetails={setSelectedOpportunity}
                    />
                  ))}
                </div>
              )}

              {/* Numbered Pagination Bar matching approved reference */}
              {pageSize > 0 && totalPages > 1 && (
                <nav
                  aria-label="Universities pagination"
                  className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="text-slate-600 leading-tight tabular-nums shrink-0">
                    <span className="font-semibold text-[#10132D]">
                      Page {currentPage} of {totalPages}
                    </span>{' '}
                    <span className="text-slate-400">
                      ({totalItems} {activeTab === 'scholarships' ? 'opportunities' : 'universities'})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none font-medium transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Previous</span>
                    </button>

                    {paginationTokens.map((token, idx) =>
                      token === 'ellipsis' ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-1.5 text-slate-400 font-semibold select-none"
                          aria-hidden="true"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={token}
                          type="button"
                          onClick={() => {
                            setCurrentPage(token);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          aria-label={`Page ${token}`}
                          aria-current={currentPage === token ? 'page' : undefined}
                          className={`min-w-[30px] h-8 px-2 rounded-lg text-xs tabular-nums transition-colors cursor-pointer ${
                            currentPage === token
                              ? 'bg-[#6846F5] text-white font-bold shadow-xs'
                              : 'bg-white border border-[#E2E8F0] text-[#10132D] hover:bg-slate-50 font-medium'
                          }`}
                        >
                          {token}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-[#6846F5] hover:bg-[#5734E6] text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </nav>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW C: TARGET LIST — FUTURE STUDY GOALS */}
          {/* ========================================================================= */}
          {activeTab === 'tracker' && (
            <div className="animate-in fade-in duration-150">
              <TargetTrackerBoard
                opportunities={opportunities}
                targetList={targetList}
                activeApplications={activeApplications}
                onUpsertTarget={handleUpsertTarget}
                onRemoveTarget={handleRemoveTarget}
                onStartApplicationFromTarget={handleStartApplication}
                onOpenApplications={() => navigateToDashboardView('overview', 'applications')}
                onOpenDetails={setSelectedOpportunity}
                onExploreMore={() => navigateToDashboardView('universities', 'home')}
                onBack={handleBackToOverview}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW D: MY PROFILE — PERSONAL & ACADEMIC IDENTITY */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <ProfileView
              activeUser={activeUser}
              profileCompletion={profileCompletion}
              profFullName={profFullName}
              setProfFullName={setProfFullName}
              profPhone={profPhone}
              setProfPhone={setProfPhone}
              profNationality={profNationality}
              setProfNationality={setProfNationality}
              profResidence={profResidence}
              setProfResidence={setProfResidence}
              profCurrentSchool={profCurrentSchool}
              setProfCurrentSchool={setProfCurrentSchool}
              profEduLevel={profEduLevel}
              setProfEduLevel={setProfEduLevel}
              profGraduationYear={profGraduationYear}
              setProfGraduationYear={setProfGraduationYear}
              profIntendedDegree={profIntendedDegree}
              setProfIntendedDegree={setProfIntendedDegree}
              profFieldOfStudy={profFieldOfStudy}
              setProfFieldOfStudy={setProfFieldOfStudy}
              profFundingPreference={profFundingPreference}
              setProfFundingPreference={setProfFundingPreference}
              profTestPreference={profTestPreference}
              setProfTestPreference={setProfTestPreference}
              profDestinations={profDestinations}
              setProfDestinations={setProfDestinations}
              isSavingProfile={isSavingProfile}
              profileSaveFeedback={profileSaveFeedback}
              onSaveProfile={handleSaveProfile}
              onBackToOverview={handleBackToOverview}
              onOpenSecuritySettings={() => {
                setSettingsInitialTab('security');
                navigateToDashboardView('settings', 'home');
              }}
              onShowToast={showNotification}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW E: ACADEMIC RESOURCES */}
          {/* ========================================================================= */}
          {activeTab === 'resources' && (
            <ResourcesView
              onNavigateToTab={(tab) => navigateToDashboardView(tab, 'home')}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW F: STUDENT SETTINGS & ACCOUNT CENTRE */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <StudentSettingsCentre
              user={activeUser}
              onUpdateUser={(updated) => {
                setActiveUser(updated);
                if (updated.profile?.countryOfResidence) {
                  setSelectedUserCountry(updated.profile.countryOfResidence);
                }
              }}
              onLogout={onLogout || (() => {})}
              onShowNotification={showNotification}
              opportunitiesCount={opportunities.length}
              dbState={dbState}
              onManualDbSync={handleManualDbSync}
              selectedUserCountry={selectedUserCountry}
              onUpdateUserCountry={(country) => {
                setSelectedUserCountry(country);
                setCurrentPage(1);
              }}
              savedOpportunitiesCount={savedOpportunities.size}
              initialTab={settingsInitialTab}
              tabNonce={settingsTabNonce}
              onClearSavedOpportunities={() => {
                setSavedOpportunities(new Set());
                const updated = authService.clearSavedOpportunities();
                if (updated) {
                  setActiveUser(updated);
                }
              }}
            />
          )}
        </main>
      </div>

      {/* 2. Detailed Opportunity Modal matching mockup screen 3 */}
      <OpportunityDetailModal
        item={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        isSaved={selectedOpportunity ? savedOpportunities.has(selectedOpportunity.id) : false}
        onToggleSave={toggleSave}
      />

      {/* 3. COVA AI Virtual Assistant Interface */}
      <CovaAssistant
        userId={activeUser?.id}
        userName={activeUser?.fullName}
        studentProfile={activeUser?.profile}
        savedOpportunities={savedOpportunities}
        targetList={targetList}
        activeApplications={activeApplications}
        applicationTracker={applicationTracker}
        onToggleSave={toggleSave}
        onUpdateApplicationStatus={updateAppStatus}
        onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
        onNavigateToTracker={() => setActiveTab('tracker')}
      />

      {/* 4. Persistent Mobile Bottom Navigation (< md) matching approved reference */}
      <MobileBottomNav
        activeTab={
          (activeTab === 'universities' || activeTab === 'scholarships'
            ? 'explore'
            : activeTab === 'profile'
            ? 'profile'
            : 'dashboard') as MobileBottomNavTab
        }
        onSelectHome={() => {
          if (onClose) onClose();
          else navigateToDashboardView('overview', 'home');
        }}
        onSelectExplore={() => navigateToDashboardView('universities', 'home')}
        onSelectDashboard={() => navigateToDashboardView('overview', 'home')}
        onSelectProfile={() => navigateToDashboardView('profile', 'home')}
      />
    </div>
  );
};
