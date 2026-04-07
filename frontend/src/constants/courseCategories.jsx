import { Globe, Zap, BookOpen, Code, Shield, UserCheck } from 'lucide-react';
import React from 'react';

export const foundationCategories = [
  { name: 'Social Science', icon: <Globe className="w-8 h-8 text-[#008A32]" />, iconSmall: <Globe className="w-4 h-4 text-[#008A32]" />, path: '/courses' },
  { name: 'Mathematics & Natural Science', icon: <Zap className="w-8 h-8 text-[#008A32]" />, iconSmall: <Zap className="w-4 h-4 text-[#008A32]" />, path: '/courses' },
  { name: 'Natural Language', icon: <BookOpen className="w-8 h-8 text-[#008A32]" />, iconSmall: <BookOpen className="w-4 h-4 text-[#008A32]" />, path: '/courses' },
];

export const advancedCategories = [
  { name: 'Programming & Technology', icon: <Code className="w-8 h-8 text-[#FFD700]" />, iconSmall: <Code className="w-4 h-4 text-[#FFD700]" />, path: '/courses' },
  { name: 'Business & Entrepreneurship', icon: <Shield className="w-8 h-8 text-[#FFD700]" />, iconSmall: <Shield className="w-4 h-4 text-[#FFD700]" />, path: '/courses' },
  { name: 'Personal Development', icon: <UserCheck className="w-8 h-8 text-[#FFD700]" />, iconSmall: <UserCheck className="w-4 h-4 text-[#FFD700]" />, path: '/courses' },
];

export const allCategories = [
  ...foundationCategories.map(c => c.name),
  ...advancedCategories.map(c => c.name)
];

export const courseDropdownOptions = allCategories.map(category => ({
  label: category,
  value: category
}));
