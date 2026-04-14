# TalentNG Frontend Documentation

This directory contains technical documentation, guides, and reference materials for the TalentNG frontend application.

## 📚 Documentation Index

### Core Documentation

#### Code Quality & Architecture
- **[CODE_AUDIT.md](./CODE_AUDIT.md)** - Comprehensive codebase audit identifying issues and improvement areas
- **[REMEDIATION_PLAN.md](./REMEDIATION_PLAN.md)** - Phased plan for addressing technical debt and improvements

#### API Integration
- **[FRONTEND_API_AUDIT.md](./FRONTEND_API_AUDIT.md)** - Frontend API usage patterns and issues
- **[FRONTEND_RECRUITER_API_GUIDE.md](./FRONTEND_RECRUITER_API_GUIDE.md)** - Recruiter-specific API integration guide
- **[FRONTEND_TEAMS_SUPPORT_INTEGRATION.md](./FRONTEND_TEAMS_SUPPORT_INTEGRATION.md)** - Support system integration guide

#### API Contracts & Specifications
- **[OPPORTUNITIES_API_CONTRACT.md](./OPPORTUNITIES_API_CONTRACT.md)** - Opportunities API contract specification
- **[OPPORTUNITIES_RESPONSE_STRUCTURE.md](./OPPORTUNITIES_RESPONSE_STRUCTURE.md)** - Opportunities response data structure
- **[PUBLIC_DISCOVERY_APIS.md](./PUBLIC_DISCOVERY_APIS.md)** - Public discovery endpoints documentation
- **[PUBLIC_LISTING_PAGES_API_INTEGRATION.md](./PUBLIC_LISTING_PAGES_API_INTEGRATION.md)** - Public listing pages API guide
- **[PUBLIC_DETAIL_PAGES_API_INTEGRATION.md](./PUBLIC_DETAIL_PAGES_API_INTEGRATION.md)** - Public detail pages API guide

#### Feature-Specific Guides
- **[RECRUITER_APPLICATIONS_API_GUIDE.md](./RECRUITER_APPLICATIONS_API_GUIDE.md)** - Recruiter applications API usage
- **[TALENT_APPLICATIONS_API_GUIDE.md](./TALENT_APPLICATIONS_API_GUIDE.md)** - Talent applications API usage
- **[TALENT_UPCOMING_API_GUIDE.md](./TALENT_UPCOMING_API_GUIDE.md)** - Talent upcoming events API guide
- **[SESSION_FLOW_GUIDE.md](./SESSION_FLOW_GUIDE.md)** - Session management flow documentation
- **[BUSINESS_VERIFICATION_FRONTEND_GUIDE.md](./BUSINESS_VERIFICATION_FRONTEND_GUIDE.md)** - Business verification feature guide

#### Design & Styling
- **[DASHBOARD_STYLING_GUIDE.md](./DASHBOARD_STYLING_GUIDE.md)** - Dashboard styling patterns and guidelines
- **[APPLICATION_STATUS_COLOR_GUIDE.md](./APPLICATION_STATUS_COLOR_GUIDE.md)** - Application status color system
- **[SESSION_STATUS_COLOR_GUIDE.md](./SESSION_STATUS_COLOR_GUIDE.md)** - Session status color system

#### Backend Integration
- **[BACKEND_CORS_SETUP.md](./BACKEND_CORS_SETUP.md)** - CORS configuration for backend
- **[TOKEN_REFRESH_IMPLEMENTATION.md](./TOKEN_REFRESH_IMPLEMENTATION.md)** - JWT token refresh implementation
- **[API_RATE_LIMITS.md](./API_RATE_LIMITS.md)** - API rate limiting documentation
- **[RATE_LIMITING_UX_IMPROVEMENTS.md](./RATE_LIMITING_UX_IMPROVEMENTS.md)** - Rate limit UX patterns

#### Search & Filtering
- **[SEARCH_INPUT_AUDIT.md](./SEARCH_INPUT_AUDIT.md)** - Search input component audit
- **[SEARCH_INPUT_DEVELOPER_GUIDE.md](./SEARCH_INPUT_DEVELOPER_GUIDE.md)** - Search input usage guide
- **[SEARCH_INPUT_MIGRATION_GUIDE.md](./SEARCH_INPUT_MIGRATION_GUIDE.md)** - Migration guide for search components
- **[SEARCH_PARAMETER_AUDIT.md](./SEARCH_PARAMETER_AUDIT.md)** - Search parameter patterns audit
- **[FILTER_SEARCH_PATTERNS.md](./FILTER_SEARCH_PATTERNS.md)** - Filter and search pattern documentation

#### Calendar & Scheduling
- **[CALENDAR_ENDPOINT_UPDATE.md](./CALENDAR_ENDPOINT_UPDATE.md)** - Calendar endpoint updates
- **[CALENDAR_MIGRATION_COMPLETE.md](./CALENDAR_MIGRATION_COMPLETE.md)** - Calendar migration documentation

#### Product & Planning
- **[PRODUCT_SPECIFICATION.md](./PRODUCT_SPECIFICATION.md)** - Product requirements and specifications
- **[backend-tasks.md](./backend-tasks.md)** - Backend task tracking
- **[agents.md](./agents.md)** - Agent system documentation
- **[DEPENDENCY_CLEANUP_RECOMMENDATIONS.md](./DEPENDENCY_CLEANUP_RECOMMENDATIONS.md)** - Dependency management recommendations
- **[TALENT_HIRED_STAT_ISSUE.md](./TALENT_HIRED_STAT_ISSUE.md)** - Talent hired statistics issue documentation

### 📁 Subdirectories

#### [responsive/](./responsive/)
Responsive design patterns and guidelines
- **README.md** - Responsive design overview
- **QUICK_REFERENCE.md** - Quick reference for responsive patterns
- **RESPONSIVE_BEHAVIOR_GUIDE.md** - Detailed responsive behavior guide
- **COMPONENT_EXAMPLES.md** - Responsive component examples

#### [testing/](./testing/)
Testing procedures and guidelines
- **MANUAL_TESTING_SUMMARY.md** - Manual testing overview
- **MANUAL_DEVICE_TESTING_GUIDE.md** - Device testing procedures
- **MOBILE_DEVICE_TESTING_SETUP.md** - Mobile testing setup
- **DEVICE_TESTING_MATRIX.md** - Device compatibility matrix
- **ACCESSIBILITY_TESTING_PROCEDURES.md** - Accessibility testing guide
- **PERFORMANCE_TESTING_PROCEDURES.md** - Performance testing guide
- **BUG_REPORTING_TEMPLATES.md** - Bug report templates
- **checklists/** - Testing checklists for different device sizes

#### [performance/](./performance/)
Performance optimization guides
- **PERFORMANCE_OPTIMIZATION_GUIDE.md** - Performance best practices

#### [examples/](./examples/)
Component usage examples (24 example files)
- Dashboard examples (Employer, Mentor, Talent)
- Form component examples
- Navigation component examples
- UI component examples (Responsive, Mobile, Touch-friendly)

#### [archive/](./archive/)
Historical documentation and completed implementation summaries (24 archived files)
- Implementation completion documents
- Fix summaries
- Migration records

## 🔍 Finding Documentation

### By Topic

**Getting Started**
- Start with the main [README.md](../README.md) in the project root
- Review [PRODUCT_SPECIFICATION.md](./PRODUCT_SPECIFICATION.md) for product overview

**API Integration**
- Check API-specific guides in the root of this directory
- Review [FRONTEND_API_AUDIT.md](./FRONTEND_API_AUDIT.md) for patterns

**Responsive Design**
- See [responsive/](./responsive/) directory for all responsive patterns
- Quick reference: [responsive/QUICK_REFERENCE.md](./responsive/QUICK_REFERENCE.md)

**Testing**
- See [testing/](./testing/) directory for all testing guides
- Device testing: [testing/DEVICE_TESTING_MATRIX.md](./testing/DEVICE_TESTING_MATRIX.md)

**Component Examples**
- See [examples/](./examples/) directory for 24 component usage examples
- Examples are organized by feature area (employer, talent, mentor, ui)

**Code Quality**
- [CODE_AUDIT.md](./CODE_AUDIT.md) - Current state analysis
- [REMEDIATION_PLAN.md](./REMEDIATION_PLAN.md) - Improvement roadmap

### By Role

**Frontend Developers**
- [FRONTEND_API_AUDIT.md](./FRONTEND_API_AUDIT.md)
- [responsive/](./responsive/)
- [examples/](./examples/)

**Backend Developers**
- [BACKEND_CORS_SETUP.md](./BACKEND_CORS_SETUP.md)
- [TOKEN_REFRESH_IMPLEMENTATION.md](./TOKEN_REFRESH_IMPLEMENTATION.md)
- [API_RATE_LIMITS.md](./API_RATE_LIMITS.md)

**QA Engineers**
- [testing/](./testing/)
- [MANUAL_DEVICE_TESTING_GUIDE.md](./testing/MANUAL_DEVICE_TESTING_GUIDE.md)

**Product Managers**
- [PRODUCT_SPECIFICATION.md](./PRODUCT_SPECIFICATION.md)
- [backend-tasks.md](./backend-tasks.md)

**Tech Leads**
- [CODE_AUDIT.md](./CODE_AUDIT.md)
- [REMEDIATION_PLAN.md](./REMEDIATION_PLAN.md)
- [DEPENDENCY_CLEANUP_RECOMMENDATIONS.md](./DEPENDENCY_CLEANUP_RECOMMENDATIONS.md)

## 📝 Documentation Standards

### File Naming
- Use SCREAMING_SNAKE_CASE for documentation files
- Use descriptive names that indicate content
- Suffix with type: `_GUIDE.md`, `_API.md`, `_SPEC.md`

### Content Structure
- Start with a clear title and overview
- Include table of contents for long documents
- Use code examples where applicable
- Keep documentation up-to-date with code changes

### Archiving
- Move completed implementation docs to [archive/](./archive/)
- Keep only living, actively-referenced documentation in root
- Archive files with `_COMPLETE.md`, `_SUMMARY.md`, `_FIX.md` suffixes

## 🔄 Maintenance

### Updating Documentation
1. Update docs when making significant code changes
2. Review and update API guides when endpoints change
3. Archive completed implementation documents
4. Keep this index up-to-date

### Adding New Documentation
1. Create the document in the appropriate directory
2. Use consistent naming conventions
3. Add entry to this README index
4. Link from related documents

## 📞 Questions?

If you can't find what you're looking for:
1. Check the main [README.md](../README.md)
2. Search this directory for keywords
3. Ask the development team
4. Create an issue for missing documentation
