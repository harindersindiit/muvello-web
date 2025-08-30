import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomTabProps {
  defaultValue?: string;
  className?: string;
  customClass?: any;
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
  onTabChange?: (value: string) => void; // optional callback
  activeTab?: string; // New prop to control the active tab externally
}

export const CustomTab: React.FC<CustomTabProps> = ({
  defaultValue = "account",
  className = "w-full",
  customClass,
  tabs,
  onTabChange,
  activeTab: externalActiveTab, // Rename to avoid confusion with state
}) => {
  const [activeTab, setActiveTab] = useState(externalActiveTab || defaultValue);

  useEffect(() => {
    if (externalActiveTab) {
      console.log({ externalActiveTab });
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value); // notify parent if needed
  };

  return (
    <Tabs
      value={activeTab}
      className={className}
      onValueChange={handleTabChange}
    >
      <TabsList
        className={`bg-transparent rounded-none border-b-1 border-[#333] h-12 py-0 px-0 w-full mb-3 ${customClass}`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative cursor-pointer w-full py-3 text-sm font-medium text-grey data-[state=active]:text-lime-400 data-[state=active]:font-semibold data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-1/2 data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:w-full data-[state=active]:after:h-[2px] data-[state=active]:after:bg-lime-400 transition-all"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
