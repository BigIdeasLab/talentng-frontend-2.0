'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Bookmark, Check } from 'lucide-react';

type OpportunityType = 'internship' | 'job-listing' | 'volunteer' | 'part-time';
type FilterType = 'all' | 'job-listing' | 'internship' | 'volunteer' | 'applied';

interface Opportunity {
  id: string;
  posterName: string;
  posterAvatar?: string;
  date: string;
  type: OpportunityType;
  title: string;
  skills: string[];
  rate: string;
  showActions: boolean;
}

const opportunities: Opportunity[] = [
  {
    id: '1',
    posterName: 'Ifeoma Chijioke',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Nov 16',
    type: 'internship',
    title: 'Art Director / Senior Art Director Intern',
    skills: ['Mobile App Design', 'User Research', 'Visual Design', 'Wireframing'],
    rate: '$250 / Month',
    showActions: true,
  },
  {
    id: '2',
    posterName: 'Spotify',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Dec 01',
    type: 'job-listing',
    title: 'Product Designer',
    skills: ['Web Design', 'User Testing', 'Interaction Design', 'Prototyping'],
    rate: '$85/hr',
    showActions: true,
  },
  {
    id: '3',
    posterName: 'Sofia Reyes',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714?width=80',
    date: 'Mar 15',
    type: 'volunteer',
    title: 'Community Outreach Volunteer',
    skills: ['Volunteer', 'Weekend-only', 'NGO'],
    rate: '',
    showActions: false,
  },
  {
    id: '4',
    posterName: 'Paystack',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Feb 20',
    type: 'job-listing',
    title: 'UI Designer',
    skills: ['Dashboard UI', 'Accessibility Design', 'Iconography', 'Responsive Design'],
    rate: '$90/hr',
    showActions: true,
  },
  {
    id: '5',
    posterName: 'Jumia',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80',
    date: 'Nov 16',
    type: 'internship',
    title: 'Mobile App Designer',
    skills: ['Mobile App Design', 'User Research', 'Visual Design', 'Wireframing'],
    rate: '$250 / Month',
    showActions: true,
  },
  {
    id: '6',
    posterName: 'Chowdeck',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Jan 10',
    type: 'part-time',
    title: 'UX Designer',
    skills: ['Visual Design', 'A/B Testing', 'User Experience', 'Sketching'],
    rate: '$2,500 - $3,000 / Month',
    showActions: true,
  },
];

const typeConfig = {
  internship: {
    label: 'Internship',
    bgColor: 'rgba(0, 139, 71, 0.09)',
    textColor: '#008B47',
    dotColor: '#008B47',
  },
  'job-listing': {
    label: 'Job Listing',
    bgColor: 'rgba(92, 48, 255, 0.10)',
    textColor: '#5C30FF',
    dotColor: '#5C30FF',
  },
  volunteer: {
    label: 'Volunteer',
    bgColor: 'rgba(246, 188, 63, 0.10)',
    textColor: '#D99400',
    dotColor: '#D99400',
  },
  'part-time': {
    label: 'Part-time',
    bgColor: 'rgba(92, 48, 255, 0.10)',
    textColor: '#5C30FF',
    dotColor: '#5C30FF',
  },
};

export default function OpportunitiesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <div className="max-w-[1149px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          {/* Title */}
          <div className="flex items-center gap-2.5 h-12 mb-6">
            <h1 className="text-xl font-medium font-inter-tight text-black">
              Opportunities
            </h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-6">
            {/* Search Container */}
            <div className="flex-1 min-w-0 max-w-full sm:max-w-[689px]">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border border-[#E1E4EA] rounded-[10px] bg-white">
                <Search className="w-[18px] h-[18px] text-[#B2B2B2] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search Role, Level or Jobs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-[15px] font-normal font-inter-tight text-black placeholder:text-[rgba(0,0,0,0.3)] bg-transparent outline-none capitalize"
                />
              </div>
            </div>

            {/* Filter and Sort Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Filter Button */}
              <button className="flex items-center gap-1.5 px-[18px] py-2.5 bg-[#F5F5F5] rounded-[10px] hover:bg-gray-200 transition-colors">
                <SlidersHorizontal className="w-[18px] h-[18px] text-black" />
                <span className="text-[15px] font-normal font-inter-tight text-black">
                  Filter
                </span>
              </button>

              {/* Sort Button */}
              <button className="flex items-center gap-1.5 px-[18px] py-2.5 bg-[#F5F5F5] rounded-[10px] hover:bg-gray-200 transition-colors">
                <span className="text-[15px] font-normal font-inter-tight text-black">
                  Newest
                </span>
                <ChevronDown className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide pb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'job-listing', label: 'Job Lisiting' },
              { id: 'internship', label: 'Internship' },
              { id: 'volunteer', label: 'Volunteer' },
              { id: 'applied', label: 'Applied' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as FilterType)}
                className={`flex items-center justify-center px-[15px] py-[15px] whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? 'text-black'
                    : 'text-[rgba(0,0,0,0.3)] hover:text-black'
                }`}
              >
                <span className="text-[15px] font-medium font-inter-tight text-center">
                  {filter.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 pb-8">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const config = typeConfig[opportunity.type];

  return (
    <div className="flex flex-col items-center gap-6 pt-[15px] border border-[#E1E4EA] rounded-[20px] bg-white hover:shadow-md transition-shadow">
      {/* Card Content */}
      <div className="flex flex-col items-start gap-5 w-full px-3 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col items-start gap-1.5 w-full">
          {/* Profile and Type Badge */}
          <div className="flex items-center justify-between w-full">
            {/* Profile */}
            <div className="flex items-center gap-2.5">
              {opportunity.posterAvatar ? (
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${opportunity.posterAvatar})` }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex-shrink-0" />
              )}
              <div className="flex flex-col items-start gap-2.5">
                <div className="text-[15px] font-medium font-inter-tight text-black text-center">
                  {opportunity.posterName}
                </div>
                <div className="text-[14px] font-light font-inter-tight text-[#525866]">
                  {opportunity.date}
                </div>
              </div>
            </div>

            {/* Type Badge */}
            <div
              className="flex items-center gap-2 px-3 py-[15px] rounded-lg"
              style={{ backgroundColor: config.bgColor }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.dotColor }}
              />
              <span
                className="text-[13px] font-normal font-inter-tight text-center"
                style={{ color: config.textColor }}
              >
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Job Title */}
        <div className="text-[18px] font-medium font-inter-tight text-black text-center">
          {opportunity.title}
        </div>

        {/* Skills */}
        <div className="flex flex-col items-start gap-3.5 w-full">
          <div className="flex items-start content-start gap-x-1.5 gap-y-2 flex-wrap w-full min-h-[34px]">
            {opportunity.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2.5 px-3.5 py-3 rounded-[30px] bg-[#F5F5F5]"
              >
                <span className="text-[14px] font-normal font-inter-tight text-black text-center leading-[14.7px]">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col items-start gap-2.5 w-full px-3 border-t border-[#E1E4EA]">
        <div className="flex items-center justify-between w-full py-3">
          {opportunity.showActions ? (
            <>
              {/* Rate */}
              <div className="text-[18px] font-medium font-inter-tight text-black">
                {opportunity.rate}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5">
                {/* Save Button */}
                <button className="flex items-center gap-1 px-5 py-2.5 h-10 bg-[#181B25] rounded-[50px] hover:bg-[#2a2d39] transition-colors">
                  <Bookmark className="w-[18px] h-[18px] text-white" />
                  <span className="text-[14px] font-medium font-inter-tight text-white text-center">
                    Save
                  </span>
                </button>

                {/* Apply Button */}
                <button className="flex items-center gap-1 px-5 py-2.5 h-10 bg-[#5C30FF] border-[0.822px] border-[#5C30FF] rounded-[50px] hover:bg-[#4a26cc] transition-colors">
                  <Check className="w-[18px] h-[18px] text-white" />
                  <span className="text-[14px] font-medium font-inter-tight text-white text-center">
                    Apply
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Learn More Button for Volunteer */
            <div className="flex items-center justify-end w-full h-10">
              <button className="flex items-center gap-1 px-5 py-2.5 h-10 bg-[#5C30FF] border-[0.822px] border-[#5C30FF] rounded-[50px] hover:bg-[#4a26cc] transition-colors">
                <span className="text-[14px] font-medium font-inter-tight text-white text-center">
                  Learn More
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
