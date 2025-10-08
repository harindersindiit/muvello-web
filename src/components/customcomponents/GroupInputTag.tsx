import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TextInput from "./TextInput";
import { IMAGES } from "@/contants/images";
import { Switch } from "@/components/ui/switch";
import { DrawerSidebar } from "./DrawerSidebar";
// import { Checkbox } from "@radix-ui/react-checkbox";
import axiosInstance from "@/utils/axiosInstance";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { Checkbox } from "../ui/checkbox";

const GroupInputTag = ({
  onClickGroup,
  onSelectGroups,
}: {
  onClickGroup: () => void;
  onSelectGroups: () => void;
}) => {
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [selectedGroupsCopy, setSelectedGroupsCopy] = useState<any[]>([]);
  const [openShare, setOpenShare] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onSelectGroups(selectedGroups);
  }, [selectedGroups]);

  const handleRemove = (id: string) => {
    setSelectedGroups((prev) => prev.filter((g) => g._id !== id));
  };

  const toggleGroup = (group: any) => {
    const exists = selectedGroups.find((g) => g._id === group._id);
    if (exists) {
      setSelectedGroups(selectedGroups.filter((g) => g._id !== group._id));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const res = await axiosInstance.get("group", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { body } = res.data;
      setGroups(body.groups || []);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Fetching groups failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isShared && groups.length === 0) {
      fetchGroups();
    }
    if (!isShared) setSelectedGroups([]);
  }, [isShared]);

  const allSelected =
    selectedGroups.length === groups.length && groups.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups);
    }
  };

  const filteredGroups = groups?.filter((group) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 w-full mb-3">
        <div className="flex items-center gap-2 text-white">
          <img src={IMAGES.people} alt="" className="w-5 h-5" />
          <span className="text-sm font-medium">Also Share on Groups</span>
        </div>

        <Switch
          checked={isShared}
          onCheckedChange={setIsShared}
          className="bg-gray-600 data-[state=checked]:bg-green-500
            [&>span]:bg-white 
            data-[state=checked]:[&>span]:bg-white cursor-pointer"
        />
      </div>

      {isShared && (
        <div className="bg-white/3 p-5 rounded-lg">
          <div
            onClick={() => {
              setSelectedGroupsCopy(selectedGroups);
              setOpenShare(true);
            }}
          >
            <TextInput
              disabled={true}
              placeholder="Select Groups"
              value={inputValue}
              onChange={(val: string) => setInputValue(val)}
              onKeyDown={() => {}}
              type="text"
              icon={<img src={IMAGES.people} alt="" className="w-5 h-5" />}
              inputClassName="!bg-[#222] pr-10"
              rightIcon={
                <div className="cursor-pointer">
                  <img src={IMAGES.arrowRight} alt="" className="w-5 h-5" />
                </div>
              }
            />
          </div>

          <div className="flex gap-4 flex-wrap mt-4">
            {selectedGroups?.map((group) => (
              <div key={group._id} className="flex flex-col items-center w-20">
                <div className="relative">
                  <img
                    src={group.group_picture_url || IMAGES.groupPlaceholder}
                    alt={group.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(group._id)}
                    className="absolute -top-1 -right-1 bg-white border border-black rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <Icon
                      icon="system-uicons:cross"
                      className="text-red-500 cursor-pointer"
                    />
                  </button>
                </div>
                <p className="text-white text-xs mt-1 text-center truncate w-full">
                  {group.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <DrawerSidebar
        title="Share Post"
        submitText="Done"
        cancelText="Cancel"
        onSubmit={() => setOpenShare(false)}
        onCancel={() => {
          setSelectedGroups(selectedGroupsCopy);
          setOpenShare(false);
        }}
        open={openShare}
        setOpen={setOpenShare}
        showFooter={true}
        className="drawer-override"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h6 className="text-white text-m font-medium">
              Select Groups {groups.length > 0 && `(${groups.length})`}
            </h6>
            <button
              className={`text-primary text-sm transition-colors duration-200 rounded px-2 py-1 ${
                allSelected
                  ? "hover:bg-red-500/20 hover:text-red-400"
                  : "hover:bg-[#94eb00]/20 hover:text-[#94eb00]"
              }`}
              onClick={toggleSelectAll}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          <TextInput
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
            className="mb-3"
          />

          {isLoading ? (
            <p className="text-white text-center py-6">Loading groups...</p>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group._id}
                className={`flex items-center justify-between gap-4 mb-0 cursor-pointer group-hover:bg-gray-800/40 transition-colors`}
                onClick={() => toggleGroup(group)}
                tabIndex={0}
                role="button"
                aria-pressed={selectedGroups.some((g) => g._id === group._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleGroup(group);
                  }
                }}
              >
                <img
                  src={group.group_picture_url || IMAGES.groupPlaceholder}
                  alt={group.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex items-center gap-3 justify-between w-full border-b border-gray-800 py-4">
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      {group.name}
                    </p>
                    <p className="text-gray-400 text-xs">{group.followers}</p>
                  </div>
                  <Checkbox
                    id={`group-${group._id}`}
                    className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                    checked={selectedGroups.some((g) => g._id === group._id)}
                    onCheckedChange={() => toggleGroup(group)}
                    tabIndex={-1} // Prevent double focus
                    onClick={(e) => e.stopPropagation()} // Prevent parent click
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </DrawerSidebar>
    </div>
  );
};

export default GroupInputTag;
