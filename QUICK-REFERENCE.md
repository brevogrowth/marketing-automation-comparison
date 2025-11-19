# Quick Reference Card

## 🚀 Server Running
```
http://localhost:3002
```

## 📍 URLs

| Version | URL | Industry |
|---------|-----|----------|
| **Version 1** | http://localhost:3002/ | E-commerce Fashion |
| **Version 2** | http://localhost:3002/v2 | B2B SaaS |

## 🎯 What Changed

✅ **Both versions now in English**
✅ **Version switcher added to header**
✅ **Business assumptions kept at top in V2** (as requested)
✅ **V2 uses card-based layout** (from screenshot)

## 📊 Version 1 - Fashion E-commerce
- Traditional detailed layout
- 10 KPIs in tables
- €65 average basket
- 2.1 purchases/year
- Focus on conversion & retention

## 🎴 Version 2 - B2B SaaS (NEW!)
- Card-based grid layout
- 12 KPI cards
- $8.5M revenue
- 120 employees
- Focus on CAC, LTV, pipeline

## 🔄 Switch Versions
Click the version buttons in the header:
- **Version 1** button
- **Version 2** button

## 📁 New Files Created
```
components/
  ├── VersionSwitcher.tsx        # Version navigation
  ├── KpiCard.tsx                # Individual KPI card (V2)
  ├── HeroSectionV2.tsx          # Simple hero (V2)
  ├── CompanyProfileCard.tsx     # Company profile (V2)
  └── BusinessAssumptionsV2.tsx  # 4-input form (V2)

app/
  └── v2/
      └── page.tsx               # Version 2 page

Documentation:
  └── VERSIONS.md                # Detailed comparison
```

## 🎨 Key V2 Features

### KPI Cards Show:
- 🎯 **Target value** (e.g., "3x - 5x")
- 🔴 **Low range** (< Low $$ Drivers) with examples
- 🟢 **High range** (> High $$ Drivers) with examples
- ⚠️ **Bad examples** (when applicable)

### Business Assumptions (Top of Page):
- Annual Revenue ($M)
- Number of Employees
- Marketing Budget (% of revenue)
- Customer Base Size

### Company Profile:
- TechFlow Solutions
- B2B SaaS Platform
- 50-200 employees
- Berlin, Germany

## 🛠️ Quick Edits

### Change KPI Data (V2)
File: `app/v2/page.tsx`
Edit the `kpiData` array

### Change Company Info (V2)
File: `components/CompanyProfileCard.tsx`

### Change Business Assumptions (V2)
File: `components/BusinessAssumptionsV2.tsx`

### Change V1 Content
Edit individual component files:
- `HeroSection.tsx`
- `BusinessAssumptions.tsx`
- `SectorKpiSection.tsx`
- etc.

## 📝 To Do Next

- [ ] Connect to backend API
- [ ] Make assumptions inputs functional
- [ ] Add more industries
- [ ] Create V3 with different layout
- [ ] Add export to PDF
- [ ] Add comparison feature

## 🐛 Known Issues

None! Both versions working perfectly. ✨

## 💡 Tips

1. **Quick test**: Click version buttons to see instant switch
2. **Check mobile**: Resize browser to see responsive design
3. **Edit data**: All content is in component files
4. **Add version**: Create `/v3` folder following same pattern

---

**Everything is ready to test!** 🎉
Open your browser and navigate between versions.
