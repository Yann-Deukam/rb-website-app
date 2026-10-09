"use client";

import CommunityFeed from "./CommunityFeed";

export default function CommunityFeedWrapper() {
  const scrollToForm = () => {
    const el = document.getElementById("testimony-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return <CommunityFeed onScrollToForm={scrollToForm} />;
}
