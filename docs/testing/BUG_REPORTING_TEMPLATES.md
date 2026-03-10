# Bug Reporting Templates for Mobile Device Testing

## Overview

This document provides standardized templates for reporting bugs found during manual device testing of the responsive design implementation. Consistent bug reporting ensures efficient tracking, prioritization, and resolution of issues.

## General Bug Report Template

### Basic Information

**Bug ID**: [AUTO-GENERATED or MANUAL-ID]
**Date Reported**: [YYYY-MM-DD]
**Reporter**: [Name and Role]
**Assigned To**: [Developer/Team]
**Status**: [New/In Progress/Resolved/Closed]
**Priority**: [Critical/High/Medium/Low]
**Severity**: [Blocker/Major/Minor/Trivial]

### Device Information

**Device Model**: [e.g., iPhone 14 Pro Max]
**Operating System**: [e.g., iOS 16.5.1]
**Screen Size**: [e.g., 430x932px]
**Screen Density**: [e.g., 3x, 460 DPI]
**Browser**: [e.g., Safari 16.5]
**Browser Version**: [Full version number]
**Network Connection**: [WiFi/4G/3G/Offline]
**Network Speed**: [e.g., 50 Mbps WiFi]

### Bug Details

**Title**: [Brief, descriptive title]
**Component/Page**: [Specific component or page affected]
**Feature Area**: [Navigation/Forms/Tables/Modals/etc.]
**User Type**: [All users/Specific role/Guest users]

**Description**:
[Detailed description of the issue, including what the user was trying to accomplish]

**Steps to Reproduce**:

1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

**Expected Result**:
[What should happen according to the design/requirements]

**Actual Result**:
[What actually happens]

**Workaround**:
[If any workaround exists, describe it here]

### Environmental Factors

**Orientation**: [Portrait/Landscape/Both]
**Input Method**: [Touch/Keyboard/Mouse/Stylus]
**Accessibility**: [Screen reader enabled/Text scaling/High contrast/etc.]
**One-Handed Use**: [Does this affect one-handed usage?]
**Multitasking**: [Was the device multitasking?]

### Evidence

**Screenshots**: [Attach relevant screenshots]
**Screen Recording**: [Link to video if applicable]
**Console Logs**: [Any relevant console errors]
**Network Logs**: [Network-related issues]
**Performance Data**: [If performance-related]

### Impact Assessment

**User Impact**: [How many users are affected?]
**Business Impact**: [Does this affect core business functions?]
**Accessibility Impact**: [Does this affect users with disabilities?]
**Frequency**: [How often does this occur?]

---

## Device-Specific Bug Report Templates

### Small Phone Bug Report Template

**Device Category**: Small Phone (< 375px width)
**Common Devices**: iPhone SE, Galaxy S22, Pixel 7

#### Small Phone Specific Fields

**Touch Target Issue**: [Yes/No - Are touch targets too small?]
**One-Handed Usability**: [Affected/Not Affected]
**Content Visibility**: [Is content cut off or hidden?]
**Text Readability**: [Is text too small to read?]
**Navigation Accessibility**: [Can user access all navigation?]

#### Common Small Phone Issues

**Layout Issues**:

- [ ] Content extends beyond screen boundaries
- [ ] Horizontal scrolling required
- [ ] Overlapping elements
- [ ] Text too small to read comfortably

**Touch Interaction Issues**:

- [ ] Touch targets smaller than 44x44px
- [ ] Insufficient spacing between touch targets
- [ ] Accidental touches due to poor spacing
- [ ] Difficulty selecting small elements

**Navigation Issues**:

- [ ] Hamburger menu not accessible
- [ ] Mobile drawer doesn't open/close properly
- [ ] Navigation items too small or crowded
- [ ] Back navigation unclear or broken

### Large Phone Bug Report Template

**Device Category**: Large Phone (> 414px width)
**Common Devices**: iPhone 14 Pro Max, Galaxy S23 Ultra, Pixel 7 Pro

#### Large Phone Specific Fields

**Screen Utilization**: [Poor/Good/Excellent - How well is the larger screen used?]
**Reachability**: [Can users reach all elements with thumb?]
**Two-Handed Experience**: [How is the two-handed experience?]
**Landscape Optimization**: [Is landscape mode optimized?]

#### Common Large Phone Issues

**Layout Issues**:

- [ ] Poor utilization of larger screen space
- [ ] Elements too spread out or too cramped
- [ ] Inconsistent spacing or alignment
- [ ] Landscape mode layout problems

**Reachability Issues**:

- [ ] Important actions too far from thumb reach
- [ ] No consideration for one-handed use
- [ ] Critical buttons in hard-to-reach areas
- [ ] Poor thumb zone optimization

### Tablet Bug Report Template

**Device Category**: Tablet (768px+ width)
**Common Devices**: iPad Mini, iPad Pro, Galaxy Tab S8

#### Tablet Specific Fields

**Input Method Used**: [Touch/Keyboard/Mouse/Stylus/Combination]
**Sidebar Behavior**: [Collapsed/Full/Hidden - What was expected vs actual?]
**Modal Sizing**: [Full-screen/90% width/Fixed width - Was sizing appropriate?]
**Multi-Column Layout**: [Were multi-column layouts used appropriately?]

#### Common Tablet Issues

**Layout Issues**:

- [ ] Sidebar doesn't collapse/expand properly
- [ ] Modals are inappropriately sized
- [ ] Poor multi-column layout implementation
- [ ] Inconsistent spacing for tablet screens

**Input Method Issues**:

- [ ] Touch interactions don't work properly
- [ ] Keyboard navigation is broken
- [ ] Mouse hover states missing or incorrect
- [ ] Stylus input not recognized

**Responsive Behavior Issues**:

- [ ] Incorrect breakpoint behavior
- [ ] Elements don't adapt to tablet screen size
- [ ] Desktop features missing on large tablets
- [ ] Mobile features inappropriately shown

---

## Issue Type Specific Templates

### Performance Bug Report Template

**Performance Category**: [Loading/Runtime/Memory/Battery/Network]

#### Performance Specific Fields

**Metric Affected**: [FCP/LCP/TTI/FID/CLS/Custom metric]
**Expected Performance**: [Target value]
**Actual Performance**: [Measured value]
**Performance Tool Used**: [Lighthouse/DevTools/WebPageTest/etc.]
**Network Condition**: [WiFi/4G/3G/Throttled]

#### Performance Evidence

**Lighthouse Score**: [Overall score and category scores]
**DevTools Timeline**: [Attach performance timeline]
**Network Waterfall**: [Network timing information]
**Memory Usage**: [Memory consumption data]
**CPU Usage**: [CPU utilization data]

### Accessibility Bug Report Template

**Accessibility Category**: [Screen Reader/Keyboard/Visual/Motor/Cognitive]
**WCAG Guideline**: [Specific WCAG 2.1 guideline violated]
**Assistive Technology**: [VoiceOver/TalkBack/Keyboard/etc.]

#### Accessibility Specific Fields

**User Impact**: [How does this affect users with disabilities?]
**Severity Level**: [Prevents access/Difficult to use/Minor inconvenience]
**WCAG Level**: [A/AA/AAA violation]
**Compliance Risk**: [Legal/Regulatory compliance implications]

#### Accessibility Evidence

**Screen Reader Output**: [What the screen reader announces]
**Keyboard Navigation**: [Tab order and focus behavior]
**Color Contrast**: [Contrast ratio measurements]
**Focus Indicators**: [Visibility of focus indicators]

### Visual/UI Bug Report Template

**Visual Category**: [Layout/Typography/Colors/Images/Icons/Animations]

#### Visual Specific Fields

**Design Comparison**: [How does this differ from the design?]
**Cross-Device Consistency**: [Is this consistent across devices?]
**Brand Impact**: [Does this affect brand consistency?]
**User Confusion**: [Could this confuse users?]

#### Visual Evidence

**Design Mockup**: [Link to original design]
**Actual Screenshot**: [What it currently looks like]
**Comparison**: [Side-by-side comparison if helpful]
**Multiple Devices**: [How it appears on different devices]

---

## Bug Severity and Priority Guidelines

### Severity Levels

**Blocker**:

- Application crashes or becomes unusable
- Data loss or corruption
- Security vulnerabilities
- Complete feature failure

**Major**:

- Significant functionality impaired
- Poor user experience for core features
- Accessibility barriers for disabled users
- Performance issues affecting usability

**Minor**:

- Cosmetic issues that don't affect functionality
- Minor usability improvements
- Edge case scenarios
- Non-critical feature enhancements

**Trivial**:

- Typos or minor text issues
- Very minor visual inconsistencies
- Suggestions for improvement
- Nice-to-have features

### Priority Levels

**Critical**:

- Must be fixed before release
- Affects core business functionality
- Legal or compliance requirements
- Affects large number of users

**High**:

- Should be fixed in current release cycle
- Affects important user workflows
- Impacts user satisfaction significantly
- Affects specific user segments

**Medium**:

- Can be scheduled for future release
- Minor impact on user experience
- Affects edge cases or rare scenarios
- Enhancement opportunities

**Low**:

- Nice to have improvements
- Very minor issues
- Future consideration items
- Cosmetic improvements

---

## Bug Workflow and Status Tracking

### Bug Lifecycle

1. **New**: Bug reported and awaiting triage
2. **Triaged**: Bug reviewed and prioritized
3. **Assigned**: Bug assigned to developer
4. **In Progress**: Developer working on fix
5. **Ready for Testing**: Fix implemented, ready for verification
6. **Testing**: QA testing the fix
7. **Resolved**: Fix verified and working
8. **Closed**: Bug officially closed
9. **Reopened**: Bug reoccurred or fix insufficient

### Status Definitions

**Open Statuses**:

- **New**: Recently reported, not yet reviewed
- **Confirmed**: Issue confirmed and reproducible
- **Assigned**: Assigned to specific developer
- **In Progress**: Actively being worked on

**Closed Statuses**:

- **Fixed**: Issue resolved with code changes
- **Won't Fix**: Issue acknowledged but won't be addressed
- **Duplicate**: Same as another reported issue
- **Cannot Reproduce**: Unable to reproduce the issue
- **Works as Designed**: Behavior is intentional

---

## Bug Report Quality Checklist

### Before Submitting

- [ ] **Clear Title**: Title clearly describes the issue
- [ ] **Reproducible**: Steps to reproduce are clear and work
- [ ] **Complete Information**: All required fields filled out
- [ ] **Evidence Attached**: Screenshots or recordings included
- [ ] **Impact Assessed**: User and business impact described
- [ ] **Duplicate Check**: Verified this isn't already reported
- [ ] **Workaround Noted**: Any workarounds documented

### Review Criteria

- [ ] **Actionable**: Developer can understand and act on the report
- [ ] **Specific**: Issue is specific, not vague or general
- [ ] **Objective**: Report is factual, not opinion-based
- [ ] **Complete**: All necessary information provided
- [ ] **Prioritized**: Appropriate severity and priority assigned

---

## Bug Reporting Tools Integration

### Jira Bug Report Template

```json
{
  "fields": {
    "project": { "key": "MOBILE" },
    "summary": "[Device] Brief description of issue",
    "description": "Detailed description with steps to reproduce",
    "issuetype": { "name": "Bug" },
    "priority": { "name": "High" },
    "labels": ["mobile", "responsive", "device-testing"],
    "customfield_device": "iPhone 14 Pro Max",
    "customfield_os": "iOS 16.5",
    "customfield_browser": "Safari 16.5",
    "customfield_screensize": "430x932px"
  }
}
```

### GitHub Issue Template

```markdown
---
name: Mobile Device Bug Report
about: Report a bug found during mobile device testing
title: "[DEVICE] Brief description"
labels: bug, mobile, device-testing
assignees: ""
---

## Device Information

- **Device**:
- **OS**:
- **Browser**:
- **Screen Size**:
- **Network**:

## Bug Description

**Summary**:

**Steps to Reproduce**:

1.
2.
3.

**Expected**:
**Actual**:

## Evidence

- [ ] Screenshot attached
- [ ] Screen recording available
- [ ] Console logs included

## Impact

- **Severity**:
- **User Impact**:
- **Accessibility Impact**:
```

This comprehensive bug reporting system ensures that all issues found during manual device testing are properly documented, tracked, and resolved efficiently.
