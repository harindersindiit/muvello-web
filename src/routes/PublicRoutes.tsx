import { Route, Routes } from "react-router-dom";

import AboutMirin from "@/pages/cmsPages/AboutMirin";
import PrivacyPolicy from "@/pages/cmsPages/PrivacyPolicy";
import TermsAndConditions from "@/pages/cmsPages/TermsAndConditions";

const PublicRoutes = () => {
  return (
    <div className="bg-black min-h-[calc(100vh-57px)]">
      <div className="px-3 lg:px-10 pt-7">
        <Routes>
          <Route path="about-muvello" element={<AboutMirin />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </div>
  );
};

export default PublicRoutes;
