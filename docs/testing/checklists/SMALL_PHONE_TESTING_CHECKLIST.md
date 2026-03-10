# Small Phone Testing Checklist (< 375px width)

## Device Specifications

- **Target Devices**: iPhone SE, Samsung Galaxy S22, Google Pixel 7
- **Screen Width**: < 375px
- **Key Constraints**: Limited screen real estate, one-handed usage priority

## Pre-Testing Setup

### Device Configuration

- [ ] Device is fully charged or connected to power
- [ ] Latest OS version installed
- [ ] Browser cache cleared
- [ ] Screen brightness set to 50%
- [ ] Accessibility features enabled for testing
- [ ] Screen recording capability enabled

### Network Setup

- [ ] WiFi connection tested and stable
- [ ] 4G/LTE connection available for testing
- [ ] Network throttling tools configured
- [ ] Offline mode testing capability ready

## Core Navigation Testing

### Mobile Drawer Navigation

- [ ] **Hamburger Menu Visibility**: Menu icon is clearly visible in top-left corner
- [ ] **Tap Target Size**: Hamburger button is minimum 44x44px
- [ ] **Drawer Animation**: Smooth slide-in animation from left side
- [ ] **Overlay Backdrop**: Semi-transparent backdrop appears behind drawer
- [ ] **Navigation Items**: All navigation items are visible and accessible
- [ ] **Touch Targets**: Each navigation item has minimum 44x44px tap area
- [ ] **ProfileSwitcher**: Profile switcher component displays correctly
- [ ] **Notification Badges**: Badges are visible and properly positioned
- [ ] **Auto-Close**: Drawer closes automatically after navigation selection
- [ ] **Swipe Gesture**: Swipe-to-close gesture works smoothly
- [ ] **Focus Trap**: Focus is trapped within drawer when open
- [ ] **Body Scroll**: Body scroll is prevented when drawer is open

### Header and Status Bar

- [ ] **Header Layout**: Header content fits within screen width
- [ ] **Logo/Branding**: Logo scales appropriately for small screens
- [ ] **Action Buttons**: Header buttons have adequate touch targets
- [ ] **Safe Area**: Content respects device safe areas (notch, etc.)

## Modal and Dialog Testing

### Full-Screen Modal Behavior

- [ ] **Full-Screen Rendering**: All modals render as full-screen overlays
- [ ] **Close Button**: Close button positioned in top-right corner (44x44px)
- [ ] **Content Scrolling**: Modal content scrolls when exceeding screen height
- [ ] **Keyboard Handling**: Keyboard doesn't obscure input fields
- [ ] **Form Layout**: Form fields stack vertically with full width
- [ ] **Button Layout**: Action buttons stack vertically with full width
- [ ] **Touch Feedback**: All interactive elements provide visual feedback

### Specific Modal Types

- [ ] **Filter Modals**: ApplicantFilterModal, OpportunitiesFilterModal render full-screen
- [ ] **Form Modals**: ScheduleInterviewModal, HireApplicationModal work correctly
- [ ] **Notification Modal**: NotificationsModal displays as full-screen overlay
- [ ] **Confirmation Dialogs**: ConfirmationModal, SuccessModal are touch-friendly

## Data Display Testing

### Table to Card Transformation

- [ ] **Card Layout**: Tables transform into card-based layouts
- [ ] **Data Visibility**: All essential data is visible in card format
- [ ] **Label Display**: Table headers appear as labels within cards
- [ ] **Action Menus**: Row actions accessible via dropdown menus
- [ ] **Touch Targets**: All card elements have adequate touch targets
- [ ] **Spacing**: Cards have proper spacing and visual separation
- [ ] **Scrolling**: Card list scrolls smoothly

### Specific Table Testing

- [ ] **ApplicantsTable**: Transforms to applicant cards with all data
- [ ] **OpportunitiesTable**: Shows opportunity cards with key information
- [ ] **SessionsTable**: Displays session information in card format
- [ ] **InterviewsTable**: Interview data is accessible in mobile view

### Grid Layout Testing

- [ ] **Single Column**: All grids display as single-column layouts
- [ ] **Card Sizing**: Cards maintain appropriate aspect ratios
- [ ] **Content Hierarchy**: Important information remains prominent
- [ ] **Touch Areas**: Cards are easily tappable with proper spacing

## Form Testing

### Form Layout and Usability

- [ ] **Vertical Stacking**: All form fields stack vertically
- [ ] **Full Width**: Input fields expand to full container width
- [ ] **Touch Targets**: Input fields are minimum 44px height
- [ ] **Label Position**: Labels are positioned above input fields
- [ ] **Button Layout**: Form buttons stack vertically with full width
- [ ] **Validation**: Error messages display clearly below fields
- [ ] **Keyboard Navigation**: Tab order is logical and functional

### Specific Form Testing

- [ ] **Login Form**: Username/password fields are easily accessible
- [ ] **Registration Form**: All signup fields work correctly
- [ ] **Profile Forms**: Edit profile forms adapt to mobile layout
- [ ] **Opportunity Forms**: Job posting forms are mobile-friendly
- [ ] **Filter Forms**: Search and filter forms work in mobile modals

### Input Field Testing

- [ ] **Text Inputs**: Standard text fields are properly sized
- [ ] **Dropdowns**: Select dropdowns have touch-friendly options
- [ ] **Date Pickers**: Date selection works well on touch devices
- [ ] **File Uploads**: File selection and upload work correctly
- [ ] **Checkboxes/Radios**: Selection controls have adequate touch targets

## Touch Interaction Testing

### Touch Target Validation

- [ ] **Button Sizes**: All buttons meet 44x44px minimum requirement
- [ ] **Link Targets**: Text links have adequate touch areas
- [ ] **Icon Buttons**: Icon-only buttons are large enough to tap
- [ ] **Menu Items**: Dropdown and navigation items are touch-friendly
- [ ] **Form Controls**: All form inputs have proper touch targets

### Touch Feedback and Responsiveness

- [ ] **Visual Feedback**: Tapped elements show immediate visual response
- [ ] **Active States**: Buttons show active state during touch
- [ ] **Hover Alternatives**: Hover-only interactions have touch alternatives
- [ ] **Double-Tap Prevention**: No accidental double-tap issues
- [ ] **Touch Delay**: No noticeable delay between touch and response

### Gesture Testing

- [ ] **Swipe Navigation**: Swipe gestures work where implemented
- [ ] **Pull to Refresh**: Refresh gestures work on applicable pages
- [ ] **Scroll Behavior**: Scrolling is smooth and natural
- [ ] **Pinch Zoom**: Zoom is disabled where appropriate

## Typography and Readability

### Text Sizing and Legibility

- [ ] **Body Text**: Minimum 16px font size for body content
- [ ] **Heading Hierarchy**: Headings scale appropriately for mobile
- [ ] **Button Text**: Button labels remain readable at mobile sizes
- [ ] **Link Text**: Links are clearly distinguishable and readable
- [ ] **Error Text**: Error messages are clearly visible

### Text Layout and Spacing

- [ ] **Line Height**: Adequate line spacing for readability
- [ ] **Text Wrapping**: Long text wraps properly without overflow
- [ ] **Truncation**: Text truncation works where implemented
- [ ] **Contrast**: Text meets WCAG AA contrast requirements (4.5:1)

## Performance Testing

### Loading Performance

- [ ] **Initial Load**: Page loads within 3 seconds on 4G
- [ ] **Image Loading**: Images load progressively without layout shift
- [ ] **Lazy Loading**: Below-fold content loads as needed
- [ ] **Bundle Size**: JavaScript bundle size is optimized for mobile

### Runtime Performance

- [ ] **Scrolling**: Smooth scrolling without frame drops
- [ ] **Animations**: Animations are smooth and don't cause jank
- [ ] **Memory Usage**: No memory leaks during extended use
- [ ] **Battery Impact**: Reasonable battery consumption during use

### Network Conditions

- [ ] **WiFi Performance**: Optimal performance on fast connection
- [ ] **4G Performance**: Acceptable performance on mobile data
- [ ] **3G Fallback**: Usable experience on slower connections
- [ ] **Offline Handling**: Graceful degradation when offline

## Orientation Testing

### Portrait Mode (Primary)

- [ ] **Layout Stability**: All layouts work correctly in portrait
- [ ] **Content Visibility**: All content is accessible without horizontal scroll
- [ ] **Navigation**: Mobile navigation works perfectly in portrait
- [ ] **Form Usability**: Forms are easy to complete in portrait mode

### Landscape Mode

- [ ] **Layout Adaptation**: Layout adapts appropriately to landscape
- [ ] **Tablet-like Behavior**: Uses tablet layouts where appropriate
- [ ] **Keyboard Handling**: On-screen keyboard doesn't obscure content
- [ ] **State Preservation**: User state preserved during orientation change

## Accessibility Testing

### Screen Reader Compatibility

- [ ] **VoiceOver (iOS)**: All elements announced correctly
- [ ] **TalkBack (Android)**: Navigation flow is logical
- [ ] **ARIA Labels**: Interactive elements have proper labels
- [ ] **Focus Management**: Focus moves logically through interface

### Visual Accessibility

- [ ] **Color Contrast**: All text meets WCAG AA standards
- [ ] **Focus Indicators**: Keyboard focus is clearly visible
- [ ] **Text Scaling**: Layout works with 200% text scaling
- [ ] **Color Independence**: Information isn't conveyed by color alone

### Motor Accessibility

- [ ] **Touch Targets**: All targets accommodate motor impairments
- [ ] **Gesture Alternatives**: Alternative methods for gesture-based actions
- [ ] **Timeout Handling**: Adequate time for completing actions

## Page-Specific Testing

### Authentication Pages

- [ ] **Login Page**: Form fits screen, inputs are accessible
- [ ] **Registration**: Multi-step signup works on small screens
- [ ] **Password Reset**: Password recovery flow is mobile-friendly
- [ ] **Email Verification**: Verification pages display correctly

### Dashboard Pages

- [ ] **Stat Cards**: Statistics display in single-column layout
- [ ] **Charts**: Charts scale to fit screen width
- [ ] **Navigation**: Dashboard navigation is accessible
- [ ] **Quick Actions**: Primary actions are easily accessible

### Profile Pages

- [ ] **Profile View**: Profile information displays clearly
- [ ] **Profile Edit**: Editing forms work well on small screens
- [ ] **Image Upload**: Profile picture upload is touch-friendly
- [ ] **Settings**: Account settings are accessible and functional

### Data Pages

- [ ] **Opportunities**: Job listings display as cards
- [ ] **Applicants**: Candidate information is accessible
- [ ] **Calendar**: Calendar view works in mobile format
- [ ] **Messages**: Communication features are mobile-optimized

## Bug Documentation

### Issue Tracking Template

**Device**: [iPhone SE / Galaxy S22 / Pixel 7]
**Screen Size**: [375x667 / 360x740 / 360x800]
**Browser**: [Safari / Chrome]
**Issue**: [Brief description]
**Steps**: [Reproduction steps]
**Expected**: [Expected behavior]
**Actual**: [Actual behavior]
**Severity**: [Critical/High/Medium/Low]
**Screenshot**: [Attach if applicable]

### Common Issues to Watch For

- [ ] **Touch Target Issues**: Buttons too small or poorly spaced
- [ ] **Layout Overflow**: Content extending beyond screen boundaries
- [ ] **Text Readability**: Text too small or poor contrast
- [ ] **Navigation Problems**: Difficulty accessing key features
- [ ] **Performance Issues**: Slow loading or janky interactions
- [ ] **Form Usability**: Difficult to complete forms on small screens

## Success Criteria

### Must-Have Requirements

- [ ] All core functionality accessible and usable
- [ ] Touch targets meet accessibility guidelines
- [ ] No horizontal scrolling required
- [ ] Text is readable without zooming
- [ ] Navigation is intuitive and efficient

### Optimal Experience Goals

- [ ] Smooth, native-like interactions
- [ ] Fast loading and responsive performance
- [ ] Excellent one-handed usability
- [ ] Clear visual hierarchy and information architecture
- [ ] Seamless experience across all small phone devices

## Testing Sign-off

**Tester**: ******\_\_\_\_******
**Date**: ******\_\_\_\_******
**Device Tested**: ******\_\_\_\_******
**Overall Rating**: ⭐⭐⭐⭐⭐
**Critical Issues Found**: ******\_\_\_\_******
**Recommendations**: ******\_\_\_\_******

---

**Notes**: Use this checklist for each small phone device in your testing matrix. Document all issues found and ensure they are tracked in your bug tracking system.
