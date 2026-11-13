/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Globe,
  Award,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  X,
  Filter,
  DollarSign,
  Info,
  Calendar,
  UserRound,
  Edit3,
  Check,
  Clock,
  Send,
  Trophy,
  Save,
  AlertCircle,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Database,
  Server,
  Lock,
  RefreshCw,
  RotateCw,
  Menu,
  Heart,
  Target,
  FolderCheck,
  Compass,
  ArrowUpRight,
  ArrowLeft,
  LayoutDashboard,
  BookOpen,
  Settings,
} from 'lucide-react';
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
  currentFirebaseProjectId,
  currentFirestoreDatabaseId,
  testFirestoreConnection,
  seedVerifiedOpportunitiesToFirestore,
  fetchVerifiedOpportunitiesFromFirestore,
  saveStudentProfileToFirestore,
  checkCurrentUserIsAdmin,
} from '../../services/firebase';
import { CountrySelect, CountryMultiSelect } from '../ui/CountrySelect';
import { DashboardSidebar, DashboardNavTab } from './DashboardSidebar';
import { UniversityCard } from './UniversityCard';
import { TargetTrackerBoard, ApplicationStage } from './TargetTrackerBoard';
import { SavedOpportunitiesView } from './SavedOpportunitiesView';
import { ApplicationsView } from './ApplicationsView';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { StudentSettingsCentre } from './StudentSettingsCentre';
import { UniversityLogo } from '../ui/UniversityLogo';
import { CovaAssistant } from '../assistant/CovaAssistant';

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
  onClose?: () => void;
  currentUser?: User | null;
  userEmail?: string;
  onLogout?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  initialQuery = '',
  initialDestination = '',
  onClose,
  currentUser,
  userEmail = 'scholar@campusconnect.edu',
  onLogout,
}) => {
  const initialUser = currentUser || authService.getCurrentUser();
  const [activeUser, setActiveUser] = useState<User | null>(initialUser);

  // Active Main Navigation Section (Default to 'overview', or 'universities' if query provided)
  const [activeTab, setActiveTab] = useState<DashboardNavTab>(
    initialQuery || initialDestination ? 'universities' : 'overview'
  );

  // Dedicated sub-view inside Overview for Saved Opportunities & Applications
  const [overviewSection, setOverviewSection] = useState<'home' | 'saved' | 'applications'>('home');

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  const [sortBy, setSortBy] = useState<'relevant' | 'name-asc' | 'free-fee' | 'funded'>('relevant');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // User's selected country for directory default prioritization
  // Initialized from the student's saved profile (e.g. Ghana, US, UK, Nigeria, etc.)
  const initialProfileCountry =
    initialUser?.profile?.countryOfResidence || initialUser?.country || 'Ghana';
  const [selectedUserCountry, setSelectedUserCountry] = useState<string>(initialProfileCountry);

  // Sync with active user profile updates
  useEffect(() => {
    const profCountry = activeUser?.profile?.countryOfResidence || activeUser?.country;
    if (profCountry) {
      setSelectedUserCountry(profCountry);
    }
  }, [activeUser?.profile?.countryOfResidence, activeUser?.country]);

  // Country match helper to prioritize user's home country
  const isCountryMatch = (item: OpportunityItem, targetCountry: string): boolean => {
    if (!targetCountry) return false;
    const target = targetCountry.toLowerCase().trim();
    const cName = (item.country || '').toLowerCase().trim();
    const cCode = (item.countryCode || '').toLowerCase().trim();

    if (cName === target || cCode === target) return true;
    if (cName.includes(target) || target.includes(cName)) return true;

    if (
      (target === 'usa' || target === 'us' || target === 'united states') &&
      (cCode === 'us' || cName.includes('united states'))
    )
      return true;
    if (
      (target === 'uk' || target === 'gb' || target === 'united kingdom') &&
      (cCode === 'gb' || cName.includes('united kingdom'))
    )
      return true;
    if (
      (target === 'uae' || target === 'ae') &&
      (cCode === 'ae' || cName.includes('emirates'))
    )
      return true;

    return false;
  };

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

  // Sync initial query/destination from Hero Search if updated
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
    if (res.user) {
      setActiveUser({ ...res.user });
      setActiveApplications(res.user.activeApplications || {});
      setApplicationTracker((res.user.applicationTracker as Record<string, ApplicationStage>) || {});
    }
    if (res.alreadyExists) {
      showNotification('This opportunity already has an active application.');
    } else {
      showNotification('Application started! Track deadlines and tasks in Applications.');
    }
  };

  // Update Active Application (stage or task checklist)
  const handleUpdateActiveApplication = async (
    opportunityId: string,
    patch: { stage?: ActiveApplicationStage; completedTasks?: string[]; notes?: string }
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
    setCurrentPage(1);
    showNotification('All search and filter criteria reset.');
  };

  // Filter opportunities based on activeSection & search filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      if (!item) return false;

      const fundingType = item.funding?.type || item.fundingDetails?.type || '';
      const appFeeStatus = item.applicationFee?.status || item.applicationFees?.status || '';
      const testStatus = item.testPolicy?.status || item.testWaiverRules?.status || '';

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
      if (selectedDestination && selectedDestination !== 'All Destinations 🌐') {
        const countryName = (item.country || '').toLowerCase();
        const dest = selectedDestination.toLowerCase();
        const matchesCountry = countryName === dest || countryName.includes(dest);
        if (!matchesCountry) return false;
      }

      // 3. Nationality Eligibility filter
      if (selectedNationality !== 'all') {
        const natCat = item.nationalityEligibility?.category || '';
        const regions = item.nationalityEligibility?.eligibleRegions || [];

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

      // 4. Degree Level filter
      if (selectedLevel !== 'all') {
        const levels = item.degreeLevels || [];
        const hasLevel = levels.some((l) =>
          l.toLowerCase().includes(selectedLevel.toLowerCase())
        );
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
              l.includes('informatics')
            );
          });
          if (!matches) return false;
        } else if (selectedField === 'engineering') {
          const matches = fields.some((f) => f.toLowerCase().includes('engineer'));
          if (!matches) return false;
        } else if (selectedField === 'business') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return l.includes('business') || l.includes('economics') || l.includes('management');
          });
          if (!matches) return false;
        } else if (selectedField === 'health') {
          const matches = fields.some((f) => {
            const l = f.toLowerCase();
            return l.includes('health') || l.includes('medicine') || l.includes('nursing');
          });
          if (!matches) return false;
        }
      }

      // 6. Funding Type filter
      if (selectedFunding !== 'all') {
        if (selectedFunding === 'fully-funded') {
          if (fundingType !== 'Fully Funded') return false;
        } else if (selectedFunding === 'need-met') {
          if (fundingType !== '100% Need-Met') return false;
        }
      }

      // 7. Application Fee filter
      if (selectedAppFee !== 'all') {
        if (selectedAppFee === 'free') {
          if (appFeeStatus !== 'Free ($0 Fee)') return false;
        } else if (selectedAppFee === 'waiver') {
          if (appFeeStatus !== 'Fee Waiver Available') return false;
        }
      }

      // 8. SAT / Test Policy filter
      if (selectedTestPolicy !== 'all') {
        if (selectedTestPolicy === 'test-optional') {
          if (!testStatus.includes('Test-Optional')) return false;
        }
      }

      // 9. Institution Type filter
      if (selectedInstitutionType !== 'all') {
        if (item.institutionType !== selectedInstitutionType) return false;
      }

      // 10. Search query
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

    // Default 'relevant': Universities in user's selected country appear first by default, followed by all international universities
    return list.sort((a, b) => {
      const aMatch = isCountryMatch(a, selectedUserCountry);
      const bMatch = isCountryMatch(b, selectedUserCountry);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return (a.officialName || '').localeCompare(b.officialName || '');
    });
  }, [filteredOpportunities, sortBy, selectedUserCountry]);

  // Total items and pagination
  const totalItems = prioritizedOpportunities.length;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  const paginatedOpportunities = useMemo(() => {
    if (pageSize <= 0) return prioritizedOpportunities;
    const start = (currentPage - 1) * pageSize;
    return prioritizedOpportunities.slice(start, start + pageSize);
  }, [prioritizedOpportunities, currentPage, pageSize]);

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

  // Recommended Universities for Dashboard: Prioritizes user's country and aligns with study preferences
  const recommendedUniversities = useMemo(() => {
    // 1. Gather student study preferences
    const destinations =
      activeUser?.profile?.preferredDestinations && activeUser.profile.preferredDestinations.length > 0
        ? activeUser.profile.preferredDestinations
        : [selectedUserCountry];

    const targetDegree = (activeUser?.profile?.intendedDegree || activeUser?.degreeLevel || '').toLowerCase();
    const primaryField = (activeUser?.profile?.fieldOfStudy || activeUser?.studyField || '').toLowerCase();
    const targetFields = (activeUser?.profile?.preferredFieldsOfStudy || (primaryField ? [primaryField] : [])).map((f) =>
      f.toLowerCase()
    );
    const fundingType = activeUser?.profile?.fundingTypePreference;

    // 2. Score opportunity based on destination, field of study, degree level, and funding type
    const scoreOpportunity = (opp: OpportunityItem): number => {
      let score = 0;

      // Priority country (highest weight)
      if (isCountryMatch(opp, selectedUserCountry)) {
        score += 50;
      } else if (destinations.some((dest) => isCountryMatch(opp, dest))) {
        score += 35;
      }

      // Field of study matching
      if (opp.studyFields && opp.studyFields.length > 0) {
        const matchesField = opp.studyFields.some((f) => {
          const lowerF = f.toLowerCase();
          return (
            targetFields.some((tf) => lowerF.includes(tf) || tf.includes(lowerF)) ||
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
          return false;
        });
        if (matchesDegree) score += 15;
      }

      // Funding type matching
      if (fundingType === 'fully_funded') {
        const fType = opp.fundingDetails?.type?.toLowerCase() || '';
        if (fType.includes('fully') || fType.includes('100% need-met')) score += 15;
      } else if (fundingType === 'partially_funded') {
        const fType = opp.fundingDetails?.type?.toLowerCase() || '';
        if (fType.includes('partial') || fType.includes('merit') || fType.includes('waiver')) score += 15;
      }

      // Open/active deadlines bonus
      const deadlineEval = evaluateOpportunityDeadline(opp.deadlines);
      if (deadlineEval.isOpen && !deadlineEval.isExpired) score += 5;

      return score;
    };

    const scored = opportunities.map((opp) => ({ opp, score: scoreOpportunity(opp) }));
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((s) => s.opp);
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
          className={`fixed bottom-6 right-6 z-50 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border animate-in fade-in slide-in-from-bottom-2 duration-150 ${
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
        {/* Top Header Bar with Mobile Hamburger & Scholar Profile Pill */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3 shadow-xs">
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-[#10132D] hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-slate-700" />
              <span className="hidden sm:inline text-xs font-semibold text-slate-700">Menu</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6846F5] hidden sm:inline">
                Student Portal
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="text-sm sm:text-base font-bold text-[#10132D] capitalize">
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

          {/* Right: User Avatar Pill & Home Button matching mockup */}
          <div className="flex items-center gap-3">
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

            {/* Student Profile Pill matching mockup screen 4 */}
            <div className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#10132D] text-white overflow-hidden flex items-center justify-center text-xs font-bold shrink-0">
                <img
                  src="/images/african_student_scholar.jpg"
                  alt="Student Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#10132D] leading-tight truncate max-w-[130px]">
                  {activeUser?.fullName || 'Kwame Mensah'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none">Student</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-8 sm:pb-10 lg:pb-12">
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
            />
          )}

          {activeTab === 'overview' && overviewSection === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Greeting Header */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#10132D] tracking-tight">
                  Good morning, {activeUser?.fullName?.split(' ')[0] || 'Kwame'} 👋
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Here&apos;s your education journey at a glance.
                </p>
              </div>

              {/* 4 Stat & Action Cards Grid — Each Card Performs a Distinct Function */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: MY PROFILE — Personal & Academic Identity */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#6846F5] flex items-center justify-center mb-3">
                      <UserRound className="w-5 h-5" />
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#10132D]">My Profile</h3>
                      <span className="text-2xl font-bold text-[#10132D]">
                        {profileCompletion.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full bg-[#6846F5] transition-all duration-300"
                        style={{ width: `${profileCompletion.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {profileCompletion.missingFields.length > 0
                        ? `Missing: ${profileCompletion.missingFields
                            .slice(0, 2)
                            .map((f) => f.label)
                            .join(', ')}${
                            profileCompletion.missingFields.length > 2
                              ? ` +${profileCompletion.missingFields.length - 2} more`
                              : ''
                          }`
                        : 'Personal, academic & study details complete.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToDashboardView('profile', 'home')}
                    className="text-xs font-bold text-[#6846F5] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 2: SAVED OPPORTUNITIES — Personal Bookmarks */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-bold text-[#10132D]">Saved Opportunities</h3>
                      <span className="text-2xl font-bold text-[#10132D]">
                        {counts.saved}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {counts.saved === 0
                        ? 'No bookmarked universities or scholarships yet.'
                        : `${counts.savedUnis} ${counts.savedUnis === 1 ? 'university' : 'universities'} · ${counts.savedScholarships} ${counts.savedScholarships === 1 ? 'scholarship' : 'scholarships'} bookmarked.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToDashboardView('overview', 'saved')}
                    className="text-xs font-bold text-[#6846F5] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>View Saved</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 3: APPLICATIONS — Active Application Management */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <FolderCheck className="w-5 h-5" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-bold text-[#10132D]">Applications</h3>
                      <span className="text-2xl font-bold text-[#10132D]">
                        {counts.applications}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {counts.applications === 0
                        ? 'No active applications started yet.'
                        : `${counts.preparingApps} preparing · ${counts.submittedApps} submitted${counts.acceptedApps > 0 ? ` · ${counts.acceptedApps} accepted` : ''}.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToDashboardView('overview', 'applications')}
                    className="text-xs font-bold text-[#6846F5] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>Track Progress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 4: TARGET LIST — Future Study Goals */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-bold text-[#10132D]">Target List</h3>
                      <span className="text-2xl font-bold text-[#10132D]">
                        {counts.targets}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {counts.targets === 0
                        ? 'Shortlist institutions & goals you plan to pursue.'
                        : `${counts.highPriorityTargets} high priority · ${counts.targets} future study ${counts.targets === 1 ? 'goal' : 'goals'}.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToDashboardView('tracker', 'home')}
                    className="text-xs font-bold text-[#6846F5] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>Manage Goals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recommended for You Section matching mockup screen 4 */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-[#10132D]">
                      Recommended for You
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tailored matches based on your nationality and degree goals.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToDashboardView('universities', 'home')}
                    className="text-xs font-bold text-[#6846F5] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 Grid Cards with campus images matching mockup screen 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendedUniversities.map((item) => (
                    <UniversityCard
                      key={item.id}
                      item={item}
                      variant="grid"
                      isSaved={savedOpportunities.has(item.id)}
                      onToggleSave={toggleSave}
                      onOpenDetails={setSelectedOpportunity}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW B: EXPLORE UNIVERSITIES & SCHOLARSHIPS (Mockup Screen 2) */}
          {/* ========================================================================= */}
          {(activeTab === 'universities' || activeTab === 'scholarships') && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Title & Subtitle matching mockup screen 2 */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#10132D] tracking-tight">
                  {activeTab === 'universities' ? 'Explore Universities' : 'Scholarships & Funding'}
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  {activeTab === 'universities'
                    ? `Find your dream university from ${totalItems} verified institutions worldwide.`
                    : 'Discover verified full-ride, tuition waivers, and bilateral scholarships.'}
                </p>
              </div>

              {/* Search Bar matching mockup screen 2 */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by name, city, country, or field of study..."
                      className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm font-medium rounded-xl border border-[#CBD5E1] bg-slate-50/70 focus:bg-white focus:border-[#6846F5] focus:outline-none transition-all placeholder:text-slate-400 text-[#15152F]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto px-6 bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-sm text-xs font-bold"
                  >
                    Search
                  </Button>
                </div>

                {/* Filter Controls Row matching mockup screen 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                  {/* 1. Country */}
                  <CountrySelect
                    id="dash-country-select"
                    value={selectedDestination}
                    onChange={(val) => {
                      setSelectedDestination(val);
                      setCurrentPage(1);
                    }}
                    allowAll={true}
                    allLabel="All Destinations 🌐"
                    allValue=""
                    placeholder="Country 🌐"
                    buttonClassName="h-10 bg-slate-50/70 focus:bg-white text-xs font-medium"
                  />

                  {/* 2. Degree Level */}
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Filter by degree level"
                    className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-slate-50/70 focus:bg-white focus:border-[#6846F5] focus:outline-none text-[#15152F]"
                  >
                    <option value="all">Degree Level 🎓</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="master">Master&apos;s</option>
                    <option value="phd">Doctorate / PhD</option>
                  </select>

                  {/* 3. Field of Study */}
                  <select
                    value={selectedField}
                    onChange={(e) => {
                      setSelectedField(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Filter by field of study"
                    className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-slate-50/70 focus:bg-white focus:border-[#6846F5] focus:outline-none text-[#15152F]"
                  >
                    <option value="all">Field of Study 📚</option>
                    <option value="cs-tech">Computer Science &amp; AI</option>
                    <option value="engineering">Engineering</option>
                    <option value="business">Business &amp; Economics</option>
                    <option value="health">Health &amp; Medicine</option>
                  </select>

                  {/* 4. International Eligibility */}
                  <select
                    value={selectedNationality}
                    onChange={(e) => {
                      setSelectedNationality(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Filter by eligibility"
                    className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-slate-50/70 focus:bg-white focus:border-[#6846F5] focus:outline-none text-[#15152F]"
                  >
                    <option value="all">International Eligibility 🌍</option>
                    <option value="ghanaian">Ghanaian Citizens 🇬🇭</option>
                    <option value="african">African Citizens 🌍</option>
                    <option value="international">All International 🌐</option>
                  </select>

                  {/* 5. More Filters Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`h-10 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      showAdvancedFilters || (selectedFunding !== 'all' || selectedAppFee !== 'all')
                        ? 'bg-[#F0EDFF] border-[#6846F5] text-[#6846F5]'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-[#CBD5E1] text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">More Filters</span>
                    </div>
                    {showAdvancedFilters ? (
                      <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>
                </div>

                {/* Expanded Advanced Criteria */}
                {showAdvancedFilters && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Funding Coverage
                      </label>
                      <select
                        value={selectedFunding}
                        onChange={(e) => {
                          setSelectedFunding(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-[#10132D] focus:outline-none focus:border-[#6846F5]"
                      >
                        <option value="all">All Funding Types</option>
                        <option value="fully-funded">Fully Funded</option>
                        <option value="need-met">100% Need-Met</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Application Fee
                      </label>
                      <select
                        value={selectedAppFee}
                        onChange={(e) => {
                          setSelectedAppFee(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-[#10132D] focus:outline-none focus:border-[#6846F5]"
                      >
                        <option value="all">All Fee Policies</option>
                        <option value="free">Free ($0 Fee)</option>
                        <option value="waiver">Waiver Available</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetAllFilters}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        className="w-full h-9 text-xs"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Count & Sort Bar matching mockup screen 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700">
                    <strong className="text-[#10132D] font-bold">{totalItems}</strong> universities found
                  </span>
                  <span className="text-slate-300">·</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">Prioritizing:</span>
                    <div className="relative inline-block">
                      <CountrySelect
                        id="user-priority-country"
                        value={selectedUserCountry}
                        onChange={(val) => {
                          setSelectedUserCountry(val);
                          setCurrentPage(1);
                          if (val) {
                            try {
                              const updated = authService.updateProfile({ countryOfResidence: val });
                              if (updated) {
                                setActiveUser(updated);
                                saveStudentProfileToFirestore(
                                  updated.id,
                                  updated.email,
                                  { ...updated.profile, countryOfResidence: val } as any,
                                  updated.fullName
                                ).catch(() => {});
                              }
                            } catch {
                              // Guest mode
                            }
                            showNotification(`Universities in ${val} appear first by default.`);
                          }
                        }}
                        allowAll={false}
                        placeholder="Choose your country 🌐"
                        buttonClassName="h-7 px-2.5 text-xs font-bold text-[#6846F5] bg-[#F0EDFF] hover:bg-[#E5E0FF] border border-[#DDD6FE] rounded-lg shadow-2xs cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#10132D] focus:outline-none focus:border-[#6846F5] cursor-pointer"
                  >
                    <option value="relevant">Most Relevant ({selectedUserCountry || 'My Country'} First)</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="free-fee">Free Application Fee First</option>
                    <option value="funded">Full Funding First</option>
                  </select>
                </div>
              </div>

              {/* Horizontal University Cards List matching mockup screen 2 */}
              {paginatedOpportunities.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-[#10132D]">No matching universities found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try relaxing your filters or searching for &ldquo;Ghana&rdquo;, &ldquo;Engineering&rdquo;, or &ldquo;Free&rdquo;.
                  </p>
                  <Button variant="outline" size="sm" onClick={resetAllFilters}>
                    Reset Search &amp; Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedOpportunities.map((item) => (
                    <UniversityCard
                      key={item.id}
                      item={item}
                      variant="list"
                      isSaved={savedOpportunities.has(item.id)}
                      onToggleSave={toggleSave}
                      onOpenDetails={setSelectedOpportunity}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Bar */}
              {pageSize > 0 && totalPages > 1 && (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">
                    Showing {(currentPage - 1) * pageSize + 1} – {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="px-2 font-bold text-[#10132D]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
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
            <div className="space-y-5 animate-in fade-in duration-150">
              <button
                type="button"
                onClick={handleBackToOverview}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6846F5] transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard Overview</span>
              </button>

              {/* Profile Completion & Missing Information Card */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6846F5]">
                      Personal &amp; Academic Identity
                    </span>
                    <h2 className="text-2xl font-bold font-display text-[#10132D] mt-0.5">
                      My Profile
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Manage your personal details, academic background, and study preferences.
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-2xl font-bold font-display text-[#10132D]">
                      {profileCompletion.percentage}% Complete
                    </div>
                    <p className="text-xs text-slate-500">
                      {profileCompletion.completedCount} of {profileCompletion.totalCount} profile fields filled
                    </p>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      profileCompletion.percentage === 100 ? 'bg-emerald-500' : 'bg-[#6846F5]'
                    }`}
                    style={{ width: `${profileCompletion.percentage}%` }}
                  />
                </div>

                {profileCompletion.missingFields.length > 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                    <p className="text-xs font-bold text-amber-900">
                      Missing Information ({profileCompletion.missingFields.length}) — click to complete:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profileCompletion.missingFields.map((field) => (
                        <button
                          key={field.id}
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(field.id);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              el.focus();
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold text-amber-900 transition-colors cursor-pointer"
                        >
                          + {field.label} ({field.category})
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your personal, academic, and study profile is 100% complete.</span>
                  </div>
                )}
              </div>

              {/* Editable Profile Sections */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-xs">
                {profileSaveFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                      profileSaveFeedback.type === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : profileSaveFeedback.type === 'info'
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {profileSaveFeedback.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}
                    <span>{profileSaveFeedback.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-8 max-w-3xl">
                  {/* Section 1: Personal Information */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#10132D]">1. Personal Information</h3>
                      <p className="text-xs text-slate-500">
                        Your legal identity, contact number, citizenship, and residence.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="prof-fullname"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Full Legal Name
                        </label>
                        <input
                          id="prof-fullname"
                          type="text"
                          value={profFullName}
                          onChange={(e) => setProfFullName(e.target.value)}
                          required
                          placeholder="e.g. Kwame Mensah"
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#10132D] mb-1.5">
                          Account Email Address
                        </label>
                        <input
                          type="email"
                          value={activeUser?.email || ''}
                          disabled
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="prof-phone"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Phone / WhatsApp Number
                        </label>
                        <input
                          id="prof-phone"
                          type="tel"
                          value={profPhone}
                          onChange={(e) => setProfPhone(e.target.value)}
                          placeholder="e.g. +233 24 000 0000"
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        />
                      </div>

                      <CountrySelect
                        id="prof-nationality"
                        label="Nationality / Citizenship"
                        mode="nationality"
                        value={profNationality}
                        onChange={setProfNationality}
                      />

                      <CountrySelect
                        id="prof-residence"
                        label="Current Country of Residence"
                        mode="country"
                        value={profResidence}
                        onChange={setProfResidence}
                      />
                    </div>
                  </div>

                  {/* Section 2: Academic Qualifications */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#10132D]">2. Academic Qualifications</h3>
                      <p className="text-xs text-slate-500">
                        Your current school, completed/current qualification, and graduation timeline.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="prof-school"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Current / Previous School
                        </label>
                        <input
                          id="prof-school"
                          type="text"
                          value={profCurrentSchool}
                          onChange={(e) => setProfCurrentSchool(e.target.value)}
                          placeholder="e.g. Presec Legon / KNUST"
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="prof-edu-level"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Current Education Level
                        </label>
                        <select
                          id="prof-edu-level"
                          value={profEduLevel}
                          onChange={(e) => setProfEduLevel(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        >
                          <option value="">Select education level...</option>
                          <option value="Senior High School / WASSCE">Senior High School / WASSCE</option>
                          <option value="Senior High School (WASSCE / SSSCE / WAEC)">
                            Senior High School (WASSCE / SSSCE / WAEC)
                          </option>
                          <option value="Cambridge A-Levels / International Baccalaureate (IB)">
                            Cambridge A-Levels / IB
                          </option>
                          <option value="HND / Polytechnic / Diploma">HND / Polytechnic / Diploma</option>
                          <option value="Undergraduate (Currently Enrolled Student)">
                            Undergraduate (Currently Enrolled)
                          </option>
                          <option value="Bachelor's Degree (Completed / Graduate)">
                            Bachelor&apos;s Degree (Completed)
                          </option>
                          <option value="Master's Degree (Completed / In Progress)">Master&apos;s Degree</option>
                          <option value="Doctorate / PhD">Doctorate / PhD</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="prof-grad-year"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Expected / Completed Graduation Year
                        </label>
                        <select
                          id="prof-grad-year"
                          value={profGraduationYear}
                          onChange={(e) => setProfGraduationYear(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        >
                          <option value="">Select year...</option>
                          <option value="2022">2022</option>
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                          <option value="2030+">2030+</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Study Preferences */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#10132D]">3. Study Preferences</h3>
                      <p className="text-xs text-slate-500">
                        Your target degree, academic field, destinations, funding, and standardized testing plan.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="prof-intended-degree"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Intended Degree Level
                        </label>
                        <select
                          id="prof-intended-degree"
                          value={profIntendedDegree}
                          onChange={(e) => setProfIntendedDegree(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        >
                          <option value="">Select degree...</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Undergraduate (Bachelor's)">Undergraduate (Bachelor&apos;s)</option>
                          <option value="Master's (Postgraduate)">Master&apos;s Degree</option>
                          <option value="Doctorate / PhD">Doctorate / PhD</option>
                          <option value="Direct PhD (Post-Bachelor's)">Direct PhD (Post-Bachelor&apos;s)</option>
                          <option value="Professional Degree (Pre-Med, Law, MBA)">
                            Professional Degree (Pre-Med, Law, MBA)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="prof-field"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Field of Study
                        </label>
                        <input
                          id="prof-field"
                          type="text"
                          value={profFieldOfStudy}
                          onChange={(e) => setProfFieldOfStudy(e.target.value)}
                          placeholder="e.g. Computer Science & Engineering"
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="prof-funding"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Funding Preference
                        </label>
                        <select
                          id="prof-funding"
                          value={profFundingPreference}
                          onChange={(e) => setProfFundingPreference(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        >
                          <option value="">Select funding preference...</option>
                          <option value="Fully Funded Only">Fully Funded Only</option>
                          <option value="Partial & Merit Scholarships">Partial &amp; Merit Scholarships</option>
                          <option value="Self-Funded / Standard Tuition">Self-Funded / Standard Tuition</option>
                          <option value="All Funding Types">All Funding Types</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="prof-test"
                          className="block text-xs font-semibold text-[#10132D] mb-1.5"
                        >
                          Standardized Test Preference
                        </label>
                        <select
                          id="prof-test"
                          value={profTestPreference}
                          onChange={(e) => setProfTestPreference(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#10132D] focus:border-[#6846F5] focus:outline-none"
                        >
                          <option value="">Select test preference...</option>
                          <option value="Test-Optional / Waiver Preferred">
                            Test-Optional / Waiver Preferred
                          </option>
                          <option value="WAEC / WASSCE English Accepted">
                            WAEC / WASSCE English Accepted
                          </option>
                          <option value="Taking SAT / ACT">Taking SAT / ACT</option>
                          <option value="Taking GRE / GMAT">Taking GRE / GMAT</option>
                          <option value="IELTS / TOEFL Completed">IELTS / TOEFL Completed</option>
                        </select>
                      </div>
                    </div>

                    <div id="prof-destinations" tabIndex={-1} className="focus:outline-none">
                      <CountryMultiSelect
                        label="Preferred Study Destinations"
                        selectedCountries={profDestinations}
                        onChange={setProfDestinations}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isSavingProfile}
                      rightIcon={<Save className="w-4 h-4" />}
                      className="bg-[#6846F5] hover:bg-[#5835E5] text-white shadow-md"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW E: ACADEMIC RESOURCES */}
          {/* ========================================================================= */}
          {activeTab === 'resources' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-display text-[#10132D]">
                  Academic Resources &amp; Guides
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Verified application blueprints, transcript translation tips, and fee waiver templates for African students.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6846F5] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#10132D]">WASSCE to US/UK Equivalency</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official guidance on submitting WASSCE A1-C6 grades to North American and European universities.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#10132D]">Application Fee Waiver Letter</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Template letters to request economic need or institutional fee waivers directly from admissions deans.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#10132D]">English Proficiency Waivers</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Which universities waive IELTS/TOEFL for applicants educated in English-speaking African nations.
                  </p>
                </div>
              </div>
            </div>
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
    </div>
  );
};
