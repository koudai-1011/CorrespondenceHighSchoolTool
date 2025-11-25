import { useState, useMemo } from 'react';
import { DUMMY_USERS, sortUsers } from '../data/dummyUsers';
import { useRegistrationStore } from '../stores/registrationStore';
import { useSettingsStore } from '../stores/settingsStore';

export const useUserSearch = () => {
  const { detailedTags } = useRegistrationStore();
  const { examParticipation } = useSettingsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedCareerPath, setSelectedCareerPath] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  
  const [selectedMockExam, setSelectedMockExam] = useState('');
  const [selectedTargetUniv, setSelectedTargetUniv] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const [commFilters, setCommFilters] = useState({
    approachability: 0,
    initiative: 0,
    responseSpeed: 0,
    deepVsCasual: 0,
    onlineActivity: 0,
  });

  const [seasonalAnswer, setSeasonalAnswer] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    DUMMY_USERS.forEach(u => u.detailedTags.forEach(t => tags.add(t.name)));
    return Array.from(tags);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const suggestions = allTags.filter(t => t.toLowerCase().includes(query.toLowerCase()));
      setTagSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setTagSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectTag = (tag: string) => {
    setSearchQuery(tag);
    setShowSuggestions(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPrefecture('');
    setSelectedGrade('');
    setSelectedAge('');
    setSelectedCareerPath('');
    setSelectedSchool('');
    setSelectedMockExam('');
    setSelectedTargetUniv('');
    setSelectedSubject('');
    setCommFilters({
      approachability: 0,
      initiative: 0,
      responseSpeed: 0,
      deepVsCasual: 0,
      onlineActivity: 0,
    });
    setSeasonalAnswer('');
  };

  const filteredUsers = useMemo(() => {
    let users = [...DUMMY_USERS];

    if (searchQuery) {
      users = users.filter(u => 
        u.detailedTags.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPrefecture) users = users.filter(u => u.prefecture.includes(selectedPrefecture));
    if (selectedGrade) users = users.filter(u => u.grade === selectedGrade);
    if (selectedAge) users = users.filter(u => u.age === selectedAge);
    if (selectedCareerPath) users = users.filter(u => u.careerPath === selectedCareerPath);
    if (selectedSchool) users = users.filter(u => u.schoolName.includes(selectedSchool));

    if (examParticipation) {
      if (selectedMockExam) users = users.filter(u => u.studyProfile?.mockExamName.includes(selectedMockExam));
      if (selectedTargetUniv) users = users.filter(u => u.studyProfile?.targetUniversity.includes(selectedTargetUniv));
      if (selectedSubject) users = users.filter(u => u.studyProfile?.subjects.some(s => s.includes(selectedSubject)));
    }

    if (commFilters.approachability > 0) users = users.filter(u => u.communicationType.approachability >= commFilters.approachability);
    if (commFilters.initiative > 0) users = users.filter(u => u.communicationType.initiative >= commFilters.initiative);
    if (commFilters.responseSpeed > 0) users = users.filter(u => u.communicationType.responseSpeed >= commFilters.responseSpeed);
    if (commFilters.deepVsCasual > 0) users = users.filter(u => u.communicationType.deepVsCasual >= commFilters.deepVsCasual);
    if (commFilters.onlineActivity > 0) users = users.filter(u => u.communicationType.onlineActivity >= commFilters.onlineActivity);

    if (seasonalAnswer) users = users.filter(u => u.seasonalQuestion?.answer.includes(seasonalAnswer));

    return sortUsers(users, 'match', detailedTags);
  }, [searchQuery, selectedPrefecture, selectedGrade, selectedAge, selectedCareerPath, selectedSchool, examParticipation, selectedMockExam, selectedTargetUniv, selectedSubject, commFilters, seasonalAnswer, detailedTags]);

  return {
    searchQuery,
    setSearchQuery,
    tagSuggestions,
    showSuggestions,
    showFilters,
    setShowFilters,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedGrade,
    setSelectedGrade,
    selectedAge,
    setSelectedAge,
    selectedCareerPath,
    setSelectedCareerPath,
    selectedSchool,
    setSelectedSchool,
    selectedMockExam,
    setSelectedMockExam,
    selectedTargetUniv,
    setSelectedTargetUniv,
    selectedSubject,
    setSelectedSubject,
    commFilters,
    setCommFilters,
    seasonalAnswer,
    setSeasonalAnswer,
    handleSearch,
    selectTag,
    handleResetFilters,
    filteredUsers,
    detailedTags,
    examParticipation
  };
};
