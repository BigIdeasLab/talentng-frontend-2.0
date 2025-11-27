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
  // Internships (10)
  {
    id: 'int-1',
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
    id: 'int-2',
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
    id: 'int-3',
    posterName: 'Andela',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Oct 28',
    type: 'internship',
    title: 'Frontend Development Intern',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Git'],
    rate: '$300 / Month',
    showActions: true,
  },
  {
    id: 'int-4',
    posterName: 'Flutterwave',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Nov 05',
    type: 'internship',
    title: 'Product Design Intern',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    rate: '$280 / Month',
    showActions: true,
  },
  {
    id: 'int-5',
    posterName: 'Kuda Bank',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Nov 12',
    type: 'internship',
    title: 'UX Writing Intern',
    skills: ['Content Writing', 'UX Research', 'Microcopy', 'Communication'],
    rate: '$200 / Month',
    showActions: true,
  },
  {
    id: 'int-6',
    posterName: 'Interswitch',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Oct 15',
    type: 'internship',
    title: 'Data Analytics Intern',
    skills: ['Data Analysis', 'Excel', 'SQL', 'Tableau'],
    rate: '$220 / Month',
    showActions: true,
  },
  {
    id: 'int-7',
    posterName: 'PiggyVest',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80',
    date: 'Nov 20',
    type: 'internship',
    title: 'Marketing Design Intern',
    skills: ['Graphic Design', 'Social Media', 'Branding', 'Adobe Suite'],
    rate: '$180 / Month',
    showActions: true,
  },
  {
    id: 'int-8',
    posterName: 'Carbon',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Oct 30',
    type: 'internship',
    title: 'Backend Development Intern',
    skills: ['Node.js', 'MongoDB', 'REST APIs', 'Docker'],
    rate: '$320 / Month',
    showActions: true,
  },
  {
    id: 'int-9',
    posterName: 'TechCabal',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Nov 08',
    type: 'internship',
    title: 'Content Writing Intern',
    skills: ['Writing', 'Research', 'SEO', 'Editing'],
    rate: '$150 / Month',
    showActions: true,
  },
  {
    id: 'int-10',
    posterName: 'Cowrywise',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Nov 22',
    type: 'internship',
    title: 'UI/UX Design Intern',
    skills: ['UI Design', 'User Testing', 'Wireframing', 'Sketch'],
    rate: '$270 / Month',
    showActions: true,
  },

  // Job Listings (10)
  {
    id: 'job-1',
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
    id: 'job-2',
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
    id: 'job-3',
    posterName: 'Meta',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Jan 15',
    type: 'job-listing',
    title: 'Senior UX Researcher',
    skills: ['User Research', 'Data Analysis', 'A/B Testing', 'Surveys'],
    rate: '$120/hr',
    showActions: true,
  },
  {
    id: 'job-4',
    posterName: 'Google',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Feb 10',
    type: 'job-listing',
    title: 'Frontend Engineer',
    skills: ['React', 'JavaScript', 'CSS', 'Performance'],
    rate: '$95/hr',
    showActions: true,
  },
  {
    id: 'job-5',
    posterName: 'Netflix',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80',
    date: 'Jan 25',
    type: 'job-listing',
    title: 'Product Manager',
    skills: ['Product Strategy', 'Roadmapping', 'Analytics', 'Stakeholder Management'],
    rate: '$110/hr',
    showActions: true,
  },
  {
    id: 'job-6',
    posterName: 'Apple',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Feb 05',
    type: 'job-listing',
    title: 'iOS Developer',
    skills: ['Swift', 'SwiftUI', 'UIKit', 'iOS SDK'],
    rate: '$105/hr',
    showActions: true,
  },
  {
    id: 'job-7',
    posterName: 'Amazon',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Jan 30',
    type: 'job-listing',
    title: 'UX Designer',
    skills: ['User Experience', 'Wireframing', 'Prototyping', 'Design Thinking'],
    rate: '$88/hr',
    showActions: true,
  },
  {
    id: 'job-8',
    posterName: 'Microsoft',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Feb 12',
    type: 'job-listing',
    title: 'Full Stack Developer',
    skills: ['Node.js', 'React', 'PostgreSQL', 'Azure'],
    rate: '$98/hr',
    showActions: true,
  },
  {
    id: 'job-9',
    posterName: 'Airbnb',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Jan 20',
    type: 'job-listing',
    title: 'Brand Designer',
    skills: ['Branding', 'Illustration', 'Motion Design', 'Typography'],
    rate: '$92/hr',
    showActions: true,
  },
  {
    id: 'job-10',
    posterName: 'Uber',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80',
    date: 'Feb 08',
    type: 'job-listing',
    title: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
    rate: '$115/hr',
    showActions: true,
  },

  // Volunteers (10)
  {
    id: 'vol-1',
    posterName: 'Sofia Reyes',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/126a26de49b65bed95ea3235e3f7da28d7c4ccdb?width=80',
    date: 'Mar 15',
    type: 'volunteer',
    title: 'Community Outreach Volunteer',
    skills: ['Volunteer', 'Weekend-only', 'NGO'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-2',
    posterName: 'Aisha Patel',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714?width=80',
    date: 'Nov 20',
    type: 'volunteer',
    title: 'Education Support Volunteer',
    skills: ['Teaching', 'Mentorship', 'Curriculum Design'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-3',
    posterName: 'Jordan Smith',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Nov 18',
    type: 'volunteer',
    title: 'Environmental Conservation Volunteer',
    skills: ['Conservation', 'Community Work', 'Weekends'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-4',
    posterName: 'Maria Garcia',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Mar 10',
    type: 'volunteer',
    title: 'Health Awareness Volunteer',
    skills: ['Health Education', 'Public Speaking', 'Community Engagement'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-5',
    posterName: 'David Chen',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Mar 05',
    type: 'volunteer',
    title: 'Youth Mentorship Volunteer',
    skills: ['Mentoring', 'Youth Development', 'Career Guidance'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-6',
    posterName: 'Emma Wilson',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Feb 28',
    type: 'volunteer',
    title: 'Animal Shelter Volunteer',
    skills: ['Animal Care', 'Fundraising', 'Event Planning'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-7',
    posterName: 'Ahmed Hassan',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Mar 12',
    type: 'volunteer',
    title: 'Food Bank Volunteer',
    skills: ['Distribution', 'Logistics', 'Community Service'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-8',
    posterName: 'Lisa Anderson',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80',
    date: 'Feb 25',
    type: 'volunteer',
    title: 'Elderly Care Volunteer',
    skills: ['Companionship', 'Activity Planning', 'Empathy'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-9',
    posterName: 'Carlos Rodriguez',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Mar 08',
    type: 'volunteer',
    title: 'Literacy Program Volunteer',
    skills: ['Teaching', 'Reading Support', 'Patience'],
    rate: '',
    showActions: false,
  },
  {
    id: 'vol-10',
    posterName: 'Nina Okonkwo',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Mar 20',
    type: 'volunteer',
    title: 'Tech for Good Volunteer',
    skills: ['Digital Literacy', 'Tech Training', 'Community Impact'],
    rate: '',
    showActions: false,
  },

  // Part-time (10)
  {
    id: 'part-1',
    posterName: 'Chowdeck',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Jan 10',
    type: 'part-time',
    title: 'UX Designer',
    skills: ['Visual Design', 'A/B Testing', 'User Experience', 'Sketching'],
    rate: '$2,500 - $3,000 / Month',
    showActions: true,
  },
  {
    id: 'part-2',
    posterName: 'Slack',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Jan 18',
    type: 'part-time',
    title: 'Content Strategist',
    skills: ['Content Strategy', 'SEO', 'Analytics', 'Writing'],
    rate: '$2,000 - $2,500 / Month',
    showActions: true,
  },
  {
    id: 'part-3',
    posterName: 'Shopify',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Jan 22',
    type: 'part-time',
    title: 'Frontend Developer',
    skills: ['React', 'CSS', 'JavaScript', 'Responsive Design'],
    rate: '$3,000 - $3,500 / Month',
    showActions: true,
  },
  {
    id: 'part-4',
    posterName: 'Notion',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Jan 12',
    type: 'part-time',
    title: 'Marketing Designer',
    skills: ['Graphic Design', 'Brand Design', 'Social Media', 'Figma'],
    rate: '$1,800 - $2,200 / Month',
    showActions: true,
  },
  {
    id: 'part-5',
    posterName: 'Figma',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Jan 25',
    type: 'part-time',
    title: 'Product Designer',
    skills: ['UI/UX', 'Prototyping', 'Design Systems', 'User Research'],
    rate: '$2,800 - $3,200 / Month',
    showActions: true,
  },
  {
    id: 'part-6',
    posterName: 'Canva',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80',
    date: 'Jan 08',
    type: 'part-time',
    title: 'Illustrator',
    skills: ['Illustration', 'Digital Art', 'Character Design', 'Adobe Illustrator'],
    rate: '$1,500 - $2,000 / Month',
    showActions: true,
  },
  {
    id: 'part-7',
    posterName: 'Webflow',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80',
    date: 'Jan 15',
    type: 'part-time',
    title: 'Web Designer',
    skills: ['Webflow', 'Web Design', 'Animations', 'Responsive'],
    rate: '$2,200 - $2,800 / Month',
    showActions: true,
  },
  {
    id: 'part-8',
    posterName: 'Framer',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80',
    date: 'Jan 20',
    type: 'part-time',
    title: 'Motion Designer',
    skills: ['Motion Graphics', 'After Effects', 'Animation', 'Video Editing'],
    rate: '$2,400 - $3,000 / Month',
    showActions: true,
  },
  {
    id: 'part-9',
    posterName: 'Dropbox',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80',
    date: 'Jan 28',
    type: 'part-time',
    title: 'Technical Writer',
    skills: ['Documentation', 'Technical Writing', 'API Docs', 'Markdown'],
    rate: '$1,900 - $2,400 / Month',
    showActions: true,
  },
  {
    id: 'part-10',
    posterName: 'Linear',
    posterAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80',
    date: 'Jan 05',
    type: 'part-time',
    title: 'Product Manager',
    skills: ['Product Management', 'Roadmapping', 'User Stories', 'Agile'],
    rate: '$3,200 - $4,000 / Month',
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

  // Filter opportunities based on active filter
  const filteredOpportunities = opportunities.filter((opportunity) => {
    // Handle filter
    if (activeFilter !== 'all' && activeFilter !== 'applied') {
      if (opportunity.type !== activeFilter) return false;
    }
    // Handle search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.posterName.toLowerCase().includes(query) ||
        opportunity.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    }
    return true;
  });

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
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium text-gray-600 mb-2">No opportunities found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
            </div>
          )}
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
