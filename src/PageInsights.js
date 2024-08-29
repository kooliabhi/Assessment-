import React, { useState, useEffect } from "react";

const PageInsights = ({ accessToken }) => {
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [insights, setInsights] = useState(null);
  const [since, setSince] = useState("2024-01-01"); // Default start date
  const [until, setUntil] = useState("2024-12-31"); // Default end date

  // Fetch pages function with pagination handling
  const fetchPages = async () => {
    let allPages = [];
    let url = `https://graph.facebook.com/v17.0/me/accounts?access_token=${accessToken}`;

    // Fetch all pages by handling pagination
    while (url) {
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data) {
          allPages = [...allPages, ...data.data];
        }

        // Check if there's a next page
        url = data.paging?.next || null;
      } catch (err) {
        console.error("Error fetching pages:", err);
        break;
      }
    }

    setPages(allPages);
  };

  // Fetch insights function
  const fetchInsights = () => {
    if (!selectedPageId) return;

    const url = `https://graph.facebook.com/v17.0/${selectedPageId}/insights?metric=page_impressions,page_engaged_users,page_fans,page_reactions&period=total_over_range&since=${since}&until=${until}&access_token=${accessToken}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const insightsData = {
            impressions: data.data.find(
              (metric) => metric.name === "page_impressions"
            )?.values[0].value,
            engagement: data.data.find(
              (metric) => metric.name === "page_engaged_users"
            )?.values[0].value,
            fans: data.data.find((metric) => metric.name === "page_fans")
              ?.values[0].value,
            reactions: data.data.find(
              (metric) => metric.name === "page_reactions"
            )?.values[0].value,
          };
          setInsights(insightsData);
        } else {
          setInsights({});
        }
      })
      .catch((err) => console.error("Error fetching insights:", err));
  };

  useEffect(() => {
    fetchPages(); // Fetch pages when the component mounts
  }, []);

  return (
    <div className="insights-container">
      {/* Page Selector */}
      <div className="page-selector">
        <label>Select a Page:</label>
        <select
          onChange={(e) => setSelectedPageId(e.target.value)}
          value={selectedPageId || ""}
        >
          <option value="" disabled>
            -- Select a Page --
          </option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Pickers for since and until */}
      <div className="date-picker">
        <label>Since:</label>
        <input
          type="date"
          value={since}
          onChange={(e) => setSince(e.target.value)}
        />
        <label>Until:</label>
        <input
          type="date"
          value={until}
          onChange={(e) => setUntil(e.target.value)}
        />
      </div>

      {/* Button to Fetch Insights */}
      <button onClick={fetchInsights} className="fetch-insights-button" disabled={!selectedPageId}>
        Fetch Insights
      </button>

      {/* Display Insights */}
      {insights && (
        <div className="insights">
          <div className="card">
            <h4>Total Impressions</h4>
            <p>{insights.impressions}</p>
          </div>
          <div className="card">
            <h4>Total Engagement</h4>
            <p>{insights.engagement}</p>
          </div>
          <div className="card">
            <h4>Total Fans</h4>
            <p>{insights.fans}</p>
          </div>
          <div className="card">
            <h4>Total Reactions</h4>
            <p>{insights.reactions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageInsights;
