# SVR Travels SaaS - ERP Frontend

This is the frontend application for the SVR Travels SaaS platform, an advanced ERP (Enterprise Resource Planning) system built specifically for fleet management, trips, and financial tracking in the travel industry.

## Project Overview

The application is built with [Next.js](https://nextjs.org/) (App Router), React, and Tailwind CSS. It follows a highly modular architecture utilizing a **Generic Metadata-Driven CRUD Framework** for core entities and custom, rich dashboards for analytics.

### Core Modules & Features Completed

Based on recent development phases, the following key modules have been fully implemented:

#### 1. Core ERP Modules
*   **Trip Management**: Complete lifecycle tracking of travel trips.
*   **Fleet Maintenance**: Tracking vehicle maintenance schedules, status, and costs.
*   **Finance Receivables**: Tracking outstanding customer payments and financial collections.

#### 2. Advanced Analytics & Reporting
The system includes a comprehensive BI (Business Intelligence) suite under the `/reports` module:
*   **Executive Dashboard**: High-level overview of total revenue, fleet status, and active trips.
*   **Revenue Analytics**: Detailed tracking of top revenue-generating customers, vehicles, drivers, and routes, along with temporal revenue trends.
*   **Expense Analytics**: Breakdown of operational expenses (fuel, maintenance, tolls, driver allowances) per vehicle and per driver with KPI grids and trend charts.
*   **Profitability Analytics**: Cross-referencing revenue and expenses to calculate net profit and margins across different dimensions (vehicles, drivers, customers, routes).
*   **Fleet Analytics**: Monitoring fleet utilization (active vs idle), average trips per vehicle, and overall fleet health.
*   **Driver Analytics**: Tracking driver performance (trips completed, revenue generated, average trip duration) with a ranking leaderboard, workload distribution (donut charts), and performance trend charts.

## Architecture Highlights

*   **Metadata-Driven CRUD**: (See `developer-guide.md`) 100% of administrative CRUD pages (Companies, Customers, Trips, Expenses, etc.) are built using a JSON-driven configuration. This ensures UI consistency and massive reduction in boilerplate.
*   **API & Query Factory**: Automated React Query hooks and Axios API clients for all standard resources.
*   **Rich Dashboards**: The Analytics modules heavily utilize Recharts (`ComposedChart`, `PieChart`, `RadialBarChart`) and `lucide-react` icons to create beautiful, responsive, and dynamic UI presentations.
*   **Client-Side Exports**: Analytics tables include built-in features to export data directly to CSV, Excel, and PDF.

## Getting Started

First, install dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Documentation

- Check `developer-guide.md` for instructions on how to add new modules using the Generic CRUD Framework.
