import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { IMAGES } from "@/contants/images";
import { CustomTab } from "@/components/customcomponents/CustomTab";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { DrawerSidebar } from "@/components/customcomponents/DrawerSidebar";
import TextInput from "@/components/customcomponents/TextInput";
import WorkoutComponent from "@/components/customcomponents/WorkoutComponent";
import { DrawerSidebarWorkoutDetails } from "@/components/customcomponents/DrawerSidebarWorkoutDetails";
import { useNavigate } from "react-router-dom";
import { CustomModal } from "@/components/customcomponents/CustomModal";
import localStorageService from "@/utils/localStorageService";
import axiosInstance from "@/utils/axiosInstance";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { useSocket } from "@/context/SocketContext";
import moment from "moment";
import ProfilePostCard from "@/components/customcomponents/ProfilePostCard";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomButton from "@/components/customcomponents/CustomButton";
import CustomTextArea from "@/components/customcomponents/CustomTextArea";
import Lines from "@/components/svgcomponents/Lines";
import FullScreenLoader from "@/components/ui/loader";
import { Loader2 } from "lucide-react";
import NoDataPlaceholder from "@/components/ui/nodata";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { reportUserSchema } from "@/utils/validations";
import { totalWorkoutDuration } from "@/lib/utils";
const AddMembersPopup = ({
  open,
  setOpen,
  followers,
  onSelect,
  selectedMembers,
  searchText,
  setSearchText,
  selectedGroup,
  handleAddNewMembers,
}) => {
  const filteredFollowers = followers.filter((exercise) =>
    exercise.fullname.toLowerCase().includes(searchText.toLowerCase())
  );

  // Extract user_ids of existing members
  const memberUserIds = selectedGroup
    ? selectedGroup.members.map((member) => member.user_id)
    : [];

  // Filter followers who are NOT already members
  const availableToAdd = filteredFollowers.filter(
    (follower) => !memberUserIds.includes(follower._id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#1f1f1f] border-0 text-white">
        <DialogHeader>
          <DialogTitle>Select New Members</DialogTitle>
          <DialogDescription className="text-white/60">
            Choose from the list below
          </DialogDescription>
        </DialogHeader>

        <TextInput
          placeholder="Search members"
          type="text"
          icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-3"
        />
        <div className="mt-4 text-white">
          {availableToAdd.map((user) => (
            <label
              key={user._id}
              htmlFor={`group-${user._id}`}
              className="flex items-start gap-3 mb-4 w-full cursor-pointer relative"
            >
              <img
                src={user.profile_picture || IMAGES.placeholderAvatar}
                alt={user.fullname}
                className="w-12 h-12 rounded-full"
              />
              <div className="border-b border-gray-600 pb-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-white text-base font-semibold">
                    {user.fullname}
                  </h3>
                  <Checkbox
                    id={`group-${user._id}`}
                    className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                    checked={selectedMembers.includes(user._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onSelect([...selectedMembers, user._id]);
                      } else {
                        onSelect(
                          selectedMembers.filter((id) => id !== user._id)
                        );
                      }
                    }}
                  />
                </div>
                <span className="text-grey text-sm font-medium">
                  {user.followerCount} Followers
                </span>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-6 text-right">
          <CustomButton
            text="Add"
            type="button"
            className="bg-primary text-black px-6 py-2 rounded-full h-15"
            onClick={() => {
              if (selectedMembers.length != 0) {
                handleAddNewMembers();
                setOpen(false);
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChooseAdmin = ({
  open,
  setOpen,
  followers,
  onSelect,
  selectedAdminId,
  searchText,
  setSearchText,
  selectedGroup,
  onSubmit,
  userId,
  leaveLoader,
}) => {
  const availableToAdd = selectedGroup
    ? selectedGroup.members.filter((member) => member.user_id != userId)
    : [];

  const filteredFollowers = availableToAdd.filter((exercise) =>
    exercise.user.fullname.toLowerCase().includes(searchText.toLowerCase())
  );

  // const availableToAdd = filteredFollowers.filter(
  //   (follower) => !memberUserIds.includes(follower._id)
  // );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#1f1f1f] border-0 text-white">
        <DialogHeader>
          <DialogTitle>Select New Admin</DialogTitle>
          <DialogDescription className="text-white/60">
            Choose one user from the list below
          </DialogDescription>
        </DialogHeader>

        <TextInput
          placeholder="Search members"
          type="text"
          icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-3"
        />

        <div className="mt-4 text-white">
          {filteredFollowers.map((user) => (
            <label
              key={user.user._id}
              htmlFor={`group-${user.user._id}`}
              className="flex items-start gap-3 mb-4 w-full cursor-pointer relative"
            >
              <img
                src={user.user.profile_picture || IMAGES.placeholderAvatar}
                alt={user.user.fullname}
                className="w-12 h-12 rounded-full"
              />
              <div className="border-b border-gray-600 pb-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-white text-base font-semibold">
                    {user.user.fullname}
                  </h3>
                  <Checkbox
                    id={`group-${user.user._id}`}
                    className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                    checked={selectedAdminId === user.user._id}
                    onCheckedChange={() => {
                      if (selectedAdminId === user.user._id) {
                        onSelect(null); // unselect if clicked again
                      } else {
                        onSelect(user.user._id);
                      }
                    }}
                  />
                </div>
                <span className="text-grey text-sm font-medium">
                  {user.user.follower_count} Followers
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 text-right">
          <CustomButton
            text={leaveLoader ? "Leaving..." : "Confirm"}
            type="button"
            className="bg-primary text-black px-6 py-2 rounded-full h-15"
            onClick={() => {
              if (selectedAdminId) {
                onSubmit();
                setOpen(false);
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GroupChatUI = () => {
  const { socket, isConnected, isAvailable, reconnect } = useSocket();
  const { user } = useUser();

  console.log(
    "Chat component - socket:",
    socket ? "present" : "undefined",
    "isConnected:",
    isConnected
  );

  const initialValues = {
    reportType: "",
    reason: "",
  };

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const messageInputRef = useRef<HTMLInputElement>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const reportOptions = [
    "Fake profile/spam",
    "Inappropriate profile photos",
    "False Information",
    "Spam or Promotions",
    "Offline behavior",
    "Violates Community Guidelines",
    "Illegal or Dangerous Activities",
    "Misleading Purpose",
    "Other",
  ];

  const [caption, setCaption] = useState("");
  const [isReport, setIsReport] = useState(false);

  const [reportType, setReportType] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReportSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorageService.getItem("accessToken");

      const payload = {
        reported_user: selectedUser._id,
        reason:
          values.reportType === "Other" ? values.reason : values.reportType,
      };

      await axiosInstance.post("/user-reports", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      resetForm();
      toast.success("Report submitted successfully.");
      setIsReport(false);
      setReportType("");
      setCaption("");
    } catch (error) {
      const message = error?.response?.data?.error || "Reporting user failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  // const [selectedGroup, setSelectedChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState<string>("groups");
  useEffect(() => {
    if (activeTab) {
      setNewMessage("");
    }
  }, [activeTab]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState<string>("");
  useEffect(() => {
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);
  // const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectGroupsOpen, setSelectGroupsOpen] = useState(false);
  const [searchGroups, setSearchGroups] = useState("");
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const navigate = useNavigate();
  const [groupDetailsOpen, setGroupDetailsOpen] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState(false);
  const [leaveGroup, setLeaveGroup] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  /// === EDIT GROUP ==== ///

  const [addNewMembersPopup, setAddNewMembersPopup] = useState(false);
  const [searchNewMembers, setSearchNewMembers] = useState("");

  const [removeMemberPopup, setRemoveMemberPopup] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState(null);

  const [editGroupName, setEditGroupName] = useState("");

  const [editGroupImage, setEditGroupImage] = useState<File | null>(null);
  const [editErrors, setEditErrors] = useState<{ name?: string }>({});
  const [editLoading, setEditLoading] = useState(false);

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditGroupImage(file);
    }
  };

  const handleUpdateGroup = async () => {
    const errors: { name?: string } = {};
    if (!editGroupName.trim()) {
      errors.name = "Group name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setEditLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const reqData: any = {
        name: editGroupName.trim(),
      };

      if (editGroupImage) {
        const formData = new FormData();
        formData.append("file", editGroupImage);
        const imgRes = await axiosInstance.post("/s3/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        reqData.group_picture_url = imgRes.data.body.fileUrl;
      }

      const groupId = selectedGroup?._id; // Ensure selectedGroup is set
      await axiosInstance.put(`/group/${groupId}`, reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Group updated successfully");
      setEditProfile(false);
      setEditErrors({});
      getMyGroups(); // Refresh list
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update group");
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddNewMembers = async () => {
    if (selectedMembers.length === 0) return;

    const memberUserIds = selectedGroup
      ? selectedGroup.members.map((member) => member.user_id)
      : [];

    const newMembers = [...memberUserIds, ...selectedMembers];

    setEditLoading(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const adminId = selectedGroup.members.find(
        (member: any) => member.is_admin
      )?.user._id;
      const reqData: any = {
        name: selectedGroup.name,
        created_by: selectedGroup.created_by,
        members: newMembers,
        group_picture_url: selectedGroup.group_picture_url,
        admin_id: adminId,
      };

      const groupId = selectedGroup?._id; // Ensure selectedGroup is set

      await axiosInstance.put(`/group/${groupId}`, reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedMembers([]);
      toast.success("The member has been added successfully");
      setEditProfile(false);
      setEditErrors({});
      getMyGroups(); // Refresh list
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update group");
    } finally {
      setEditLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    const newMembers = selectedGroup.members
      .filter((member) => removeMemberId != member.user_id)
      .map((item) => item.user_id);

    setEditLoading(true);

    try {
      const token = localStorageService.getItem("accessToken");
      const adminId = selectedGroup.members.find(
        (member: any) => member.is_admin
      )?.user._id;
      const reqData: any = {
        name: selectedGroup.name,
        created_by: selectedGroup.created_by,
        members: newMembers,
        group_picture_url: selectedGroup.group_picture_url,
        admin_id: adminId,
      };

      const groupId = selectedGroup?._id; // Ensure selectedGroup is set

      await axiosInstance.put(`/group/${groupId}`, reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("The member has been removed successfully");
      setEditProfile(false);
      setEditErrors({});
      getMyGroups(); // Refresh list
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update group");
    } finally {
      setEditLoading(false);
      setRemoveMemberPopup(false);
    }
  };

  const handleClearGroupChat = async () => {
    setEditLoading(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const groupId = selectedGroup?._id; // Ensure selectedGroup is set
      const res = await axiosInstance.delete(`/group/clear-chat/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      setChatMessages([]);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to clear chat");
    } finally {
      setEditLoading(false);
      setClearChatPopup(false);
    }
  };

  /// === EDIT GROUP ==== ///

  ///  ==== CREATE GROUP STATES ==== ///
  const [newGroupName, setNewGroupName] = useState("");
  const [followers, setFollowers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  // const [messages, setMessages] = useState([]);
  const CHAT_EVENTS = {
    DIRECT: "direct_chat",
    GROUP: "group_chat",
  };

  const getFollowers = async () => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get("user/follow-list/followers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFollowers(res.data.body.list);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
    }
  };

  const [createGroupLoader, setCreateGroupLoader] = useState(false);
  const handleCreateGroup = async () => {
    const trimmedName = newGroupName.trim();
    console.log({ trimmedName });
    try {
      if (!newGroupName.trimStart() || selectedMembers.length === 0)
        return toast.error("Group name and members are required..");
      setCreateGroupLoader(true);
      const token = localStorageService.getItem("accessToken");
      const reqData = {
        name: newGroupName,
        created_by: user._id,
        members: [user._id.toString(), ...selectedMembers],
      };

      if (groupImage) {
        const formData = new FormData();
        formData.append("file", groupImage); // 👈 Your backend should accept `image` fiel

        const res = await axiosInstance.post("/s3/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const { body } = res.data;
        if (body) {
          reqData.group_picture_url = body.fileUrl;
        }
      }

      const res = await axiosInstance.post("group", reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectGroupsOpen(false);
      setNewGroupName("");
      setGroupImage(null);
      setSelectedMembers([]);
      getMyGroups();

      toast.success(res.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
      setCreateGroupLoader(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setGroupImage(file);
    }
  };

  const handleLeaveGroup = async () => {
    setLeaveLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const reqData = { group_id: selectedGroup._id };

      const isAdmin = selectedGroup.members.find(
        (item) => item.user_id === user._id && item.is_admin
      );

      if (isAdmin && !selectedAdminId && selectedGroup.members.length > 1) {
        return toast.error(
          "Please assign a new admin before leaving the group."
        );
      }
      if (selectedAdminId) reqData.new_admin_id = selectedAdminId;

      const res = await axiosInstance.post("group/leave", reqData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getMyGroups();
      toast.success(res.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
      setLeaveLoader(true);
    }
  };

  const [deleteGroupLoader, setDeleteGroupLoader] = useState(false);
  const handleDeleteGroup = async () => {
    setDeleteGroupLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");

      const isAdmin = selectedGroup.members.find(
        (item) => item.user_id === user._id && item.is_admin
      );

      if (!isAdmin) {
        return toast.error("You are not authorised for this operation");
      }

      const res = await axiosInstance.delete(`group/${selectedGroup._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getMyGroups();
      toast.success(res.data.message);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
      setDeleteGroup(false);
      setDeleteGroupLoader(false);
    }
  };

  const [workoutProgress, setWorkoutProgress] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState({});

  const getWorkoutProgress = async (id) => {
    // setDeleteLoader(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(`/workout/progress/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkoutProgress(res.data.body);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal Server Error.";
      toast.error(message);
    } finally {
      // setDeleteExercise(false);
      // setDeleteLoader(false);
    }
  };

  /// ==== DIRECT CHAT ====///

  const [messageRequests, setMessageRequests] = useState([]);

  const messageRequestsRef = useRef(messageRequests);
  useEffect(() => {
    messageRequestsRef.current = messageRequests;
  }, [messageRequests]);

  const [messageRequestsBackup, setMessageRequestsBackup] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockUserPopup, setBlockUserPopup] = useState(false);

  const getMessageRequests = async () => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get("direct-chat/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessageRequests(res.data.body.requests);
      setMessageRequestsBackup(res.data.body.requests);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    }
  };

  const [chatLoader, setChatLoader] = useState(false);

  const getSingleChat = async (id) => {
    try {
      setChatLoader(true);
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(
        `direct-chat/message/${id}?limit=500&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChatMessages(res.data.body.messages.reverse());
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
      setChatLoader(false);
    }
  };

  const [deleteRequestLoader, setDeleteRequestLoader] = useState(false);
  const handleRequest = async (status) => {
    try {
      setDeleteRequestLoader(true);
      // console.log(selectedUser);
      // return;
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.put(
        `direct-chat/request/${selectedUser._id}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedUser((prev) => ({
        ...prev,
        request: status,
      }));

      getMessageRequests();
      if (status === "delete") {
        setSelectedUser(null);
      }
      if (status === "accept") {
        getSingleChats();
        setActiveTab("users");
      }
      getMessageRequests();
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
      setDeleteRequestLoader(false);
    }
  };

  const [directChats, setDirectChats] = useState([]);
  const [directChatsBackup, setDirectChatsBackup] = useState([]);

  const directChatsRef = useRef(directChats);
  useEffect(() => {
    directChatsRef.current = directChats;
  }, [directChats]);

  const getSingleChats = async () => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(`/direct-chat/conversation/accept`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDirectChats(res.data.body.conversations);
      setDirectChatsBackup(res.data.body.conversations);

      if (selectedUser) {
        const conversation = res.data.body.conversations.find(
          (conversation) => conversation._id == selectedUser._id
        );
        if (!conversation) {
          setSelectedUser(null);
        }
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    }
  };

  const handleClearUserChat = async () => {
    setEditLoading(true);

    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.delete(
        `/direct-chat/clear-chat/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      setChatMessages([]);
      getSingleChats();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to clear chat");
    } finally {
      setEditLoading(false);
      setClearChatPopup(false);
    }
  };

  const [blockLoader, setBlockLoader] = useState(false);
  const handleBlockUser = async () => {
    setBlockLoader(true);
    try {
      const token = localStorageService.getItem("accessToken");
      const blocked_user_id =
        selectedUser.initiatorDetails._id == user._id
          ? selectedUser.recipientDetails._id
          : selectedUser.initiatorDetails._id;

      const res = await axiosInstance.post(
        `/user/block`,
        {
          blocked_user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      setSelectedUser(null);
      getMessageRequests();
      getSingleChats();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to block user");
    } finally {
      setBlockLoader(false);
      setBlockUserPopup(false);
    }
  };

  const sendDirectMessage = () => {
    if (!newMessage.trim() || !socket.connected) return;

    const otherUser =
      selectedUser.initiatorDetails._id === user._id
        ? selectedUser.recipientDetails
        : selectedUser.initiatorDetails;

    const messagePayload = {
      conversation_id: selectedUser._id,
      receiver_id: otherUser._id,
      sender_id: user._id,
      text: newMessage,
    };

    socket.emit("direct_chat.send_msg", messagePayload, (acknowledgement) => {
      if (acknowledgement.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            ...acknowledgement.data,
            sender: {
              _id: user._id,
              fullname: user.fullname,
              email: user.email,
              profile_picture: user.profile_picture || IMAGES.placeholderAvatar,
            },
          },
        ]);

        setNewMessage("");

        // const updatedChats = directChatsBackup.map((chat) => {
        //   if (chat._id === selectedUser._id) {
        //     return {
        //       ...chat,
        //       last_message: acknowledgement.data,
        //     };
        //   }
        //   return chat;
        // });

        getMessageRequests();
        getSingleChats();

        // // Sort by updated_at descending (most recent first)
        // const sortedChats = updatedChats.sort(
        //   (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        // );

        // console.log(sortedChats);
        // setDirectChats(sortedChats);
        // setDirectChatsBackup(sortedChats);
      } else {
        toast.error("Message failed to send");
        console.error("Message Error:", acknowledgement.error);
      }
    });
  };

  /// ==== DIRECT CHAT ====///

  const [loadingStates, setLoadingStates] = useState({
    groups: true,
    requests: true,
    followers: true,
    chats: true,
  });

  const [initAPILoading, setInitAPILoading] = useState(false);

  useEffect(() => {
    getMyGroups().finally(() =>
      setLoadingStates((prev) => ({ ...prev, groups: false }))
    );
    getMessageRequests().finally(() =>
      setLoadingStates((prev) => ({ ...prev, requests: false }))
    );
    getFollowers().finally(() =>
      setLoadingStates((prev) => ({ ...prev, followers: false }))
    );
    getSingleChats().finally(() =>
      setLoadingStates((prev) => ({ ...prev, chats: false }))
    );
  }, []);

  const isLoading = Object.values(loadingStates).some((v) => v);
  ///  ==== CREATE GROUP STATES ==== ///

  ///  ==== FETCH MY GROUPS ==== ///
  const [myGroups, setMyGroups] = useState([]);
  const [myGroupsBackup, setMyGroupsBackup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const getMyGroups = async () => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get("group", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyGroups(res.data.body.groups);
      setMyGroupsBackup(res.data.body.groups);
      if (selectedGroup) {
        const group = res.data.body.groups.find(
          (item) => item._id == selectedGroup._id
        );

        // setSelectedGroup(group || null);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    }
  };

  const [groupChatLoader, setGroupChatLoader] = useState(false);

  const getGroupChat = async (id) => {
    try {
      setGroupChatLoader(true);

      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(
        `group/messages/${id}?limit=500&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChatMessages(res.data.body.messages.reverse());
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    } finally {
      setGroupChatLoader(false);
    }
  };

  const getGroupDetails = async () => {
    try {
      const token = localStorageService.getItem("accessToken");

      const res = await axiosInstance.get(`group?id=${selectedGroup._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedGroup(res.data.body.groups[0]);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Internal server error.";
      toast.error(message);
    }
  };

  ///  ==== FETCH MY GROUPS ==== ///

  ///  ==== SEND MESSAGE ==== ///
  const [clearChatPopup, setClearChatPopup] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState(null);

  useEffect(() => {
    // Connect and listen
    if (!socket) return;

    console.log("Setting up socket event listeners for chat");

    // Define event handlers
    const handleConnect = () => {
      console.log("Connected to socket server", socket.id);
      // When socket reconnects, rejoin current room if any
      if (selectedGroup?._id) {
        console.log(
          "Rejoining group room after reconnection:",
          selectedGroup._id
        );
        joinRoom(selectedGroup._id);
      } else if (selectedUser?._id) {
        console.log(
          "Rejoining direct chat room after reconnection:",
          selectedUser._id
        );
        joinRoom(selectedUser._id);
      }
    };

    const handleGroupReceiveMessage = (data) => {
      setChatMessages((prev) => [...prev, data[0]]);
      getMyGroups();
    };

    const handleDirectReceiveMessage = (data) => {
      setChatMessages((prev) => [...prev, data]);
      getSingleChats();
    };

    const handleGroupUpdated = (data) => {
      console.log("CHAT_EVENTS.GROUP");
      getMyGroups();
    };

    const handleDirectNewRequest = (data) => {
      getMessageRequests();
    };

    const handleUserOnline = (userId) => {
      console.log("User is online", userId);
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    };

    const handleOnlineUsers = (users) => {
      console.log("online_users", users);
      setOnlineUsers(users);
    };

    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    };

    const handleTyping = ({ fromUserId, conversation_id }) => {
      console.log("Typing", fromUserId, conversation_id);
      if (selectedUser && conversation_id == selectedUser._id) {
        setTypingStatus(fromUserId);
      }
    };

    const handleStopTyping = ({ fromUserId, conversation_id }) => {
      if (selectedUser && conversation_id == selectedUser._id) {
        setTypingStatus(null);
      }
    };

    // Remove all existing listeners first to prevent duplicates
    socket.off("connect", handleConnect);
    socket.off(
      `${CHAT_EVENTS.GROUP}.receive_message`,
      handleGroupReceiveMessage
    );
    socket.off(
      `${CHAT_EVENTS.DIRECT}.receive_message`,
      handleDirectReceiveMessage
    );
    socket.off(`${CHAT_EVENTS.GROUP}.updated`, handleGroupUpdated);
    socket.off(`${CHAT_EVENTS.DIRECT}.new_request`, handleDirectNewRequest);
    socket.off("user_online", handleUserOnline);
    socket.off("online_users", handleOnlineUsers);
    socket.off("user_offline", handleUserOffline);
    socket.off("typing", handleTyping);
    socket.off("stop_typing", handleStopTyping);

    // Add event listeners
    socket.on("connect", handleConnect);
    socket.on(
      `${CHAT_EVENTS.GROUP}.receive_message`,
      handleGroupReceiveMessage
    );
    socket.on(
      `${CHAT_EVENTS.DIRECT}.receive_message`,
      handleDirectReceiveMessage
    );
    socket.on(`${CHAT_EVENTS.GROUP}.updated`, handleGroupUpdated);
    socket.on(`${CHAT_EVENTS.DIRECT}.new_request`, handleDirectNewRequest);
    socket.on("user_online", handleUserOnline);
    socket.on("online_users", handleOnlineUsers);
    socket.on("user_offline", handleUserOffline);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      console.log("Cleaning up socket event listeners");
      socket.off("connect", handleConnect);
      socket.off(
        `${CHAT_EVENTS.GROUP}.receive_message`,
        handleGroupReceiveMessage
      );
      socket.off(
        `${CHAT_EVENTS.DIRECT}.receive_message`,
        handleDirectReceiveMessage
      );
      socket.off(`${CHAT_EVENTS.GROUP}.updated`, handleGroupUpdated);
      socket.off(`${CHAT_EVENTS.DIRECT}.new_request`, handleDirectNewRequest);
      socket.off("user_online", handleUserOnline);
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_offline", handleUserOffline);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, selectedGroup, selectedUser]);

  // Handle socket reconnection when component mounts or socket becomes available
  useEffect(() => {
    if (socket && socket.connected) {
      console.log("Socket is connected, ensuring room is joined");
      // If we have a selected room, make sure we're joined to it
      if (selectedGroup?._id) {
        console.log("Ensuring group room is joined:", selectedGroup._id);
        joinRoom(selectedGroup._id);
      } else if (selectedUser?._id) {
        console.log("Ensuring direct chat room is joined:", selectedUser._id);
        joinRoom(selectedUser._id);
      }
    }
  }, [socket?.connected, selectedGroup, selectedUser]);

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedGroup, selectedUser]); // Focus when selected chat changes

  const editGroupNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editProfile) {
      setTimeout(() => {
        if (editGroupNameRef.current) {
          const len = editGroupNameRef.current.value.length;
          editGroupNameRef.current.setSelectionRange(len, len);
          editGroupNameRef.current.focus();
        }
      }, 100);
    }
  }, [editProfile]);

  const sendGroupMessage = () => {
    if (!newMessage.trim() || !socket.connected) return;

    const messagePayload = {
      group_id: selectedGroup._id,
      sender_id: user._id,
      text: newMessage,
    };

    socket.emit("group_chat.send_msg", messagePayload, (acknowledgement) => {
      if (acknowledgement.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            ...acknowledgement.data[0],
            sender: {
              _id: user._id,
              fullname: user.fullname,
              email: user.email,
              profile_picture: user.profile_picture || IMAGES.placeholderAvatar,
            },
          },
        ]);
        getMyGroups();
        setNewMessage("");
      } else {
        toast.error("Message failed to send");
        console.error("Message Error:", acknowledgement.error);
      }
    });
  };
  const messagesEndRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [chatMessages.length]);

  const joinRoom = (room) => {
    socket.emit("joinRoom", room, (acknowledgement) => {
      console.log("acknowledgement", acknowledgement);
      if (acknowledgement.success) {
      } else {
        toast.error("Message failed to send");
        console.error("Message Error:", acknowledgement.error);
      }
    });
  };

  const [groupAdmin, setGroupAdmin] = useState(null);

  useEffect(() => {
    let roomId = null;

    if (selectedGroup?._id) {
      roomId = selectedGroup._id;
    } else if (selectedUser?._id) {
      roomId = selectedUser._id;
    }

    console.log(
      "Room ID:",
      roomId,
      "Socket:",
      socket ? "present" : "undefined",
      "Socket connected:",
      socket?.connected
    );

    if (roomId && socket?.connected) {
      console.log("Joining room:", roomId);
      joinRoom(roomId);

      // fetch the appropriate chat
      if (selectedGroup?._id) {
        const isAdmin = selectedGroup.members.find((item) => item.is_admin);

        setGroupAdmin(isAdmin ? isAdmin.user_id : null);

        getGroupChat(roomId);
      } else {
        getSingleChat(roomId); // Replace with your direct chat fetch function
      }
    } else if (roomId && socket && !socket.connected) {
      console.log("Socket not connected, waiting for connection...");
      // Wait for socket to connect, then join room
      const handleConnect = () => {
        console.log("Socket connected, now joining room:", roomId);
        joinRoom(roomId);

        // fetch the appropriate chat
        if (selectedGroup?._id) {
          const isAdmin = selectedGroup.members.find((item) => item.is_admin);
          setGroupAdmin(isAdmin ? isAdmin.user_id : null);
          getGroupChat(roomId);
        } else {
          getSingleChat(roomId);
        }

        socket.off("connect", handleConnect);
      };

      socket.on("connect", handleConnect);

      // Cleanup function
      return () => {
        socket.off("connect", handleConnect);
      };
    } else if (roomId && !socket) {
      console.log("No socket available, cannot join room");
    }
  }, [selectedGroup, selectedUser, socket]);

  ///  ==== SEND MESSAGE ==== ///

  useEffect(() => {
    if (activeTab === "users" || activeTab === "users") setSelectedGroup(null);
    if (activeTab === "groups") setSelectedUser(null);
  }, [activeTab]);

  const filterList = (keyword) => {
    const trimmedKeyword = keyword.trim();

    if (activeTab === "groups") {
      if (!trimmedKeyword) {
        setMyGroups(myGroupsBackup); // Restore original list
      } else {
        const filtered = myGroupsBackup.filter((item) =>
          item.name.toLowerCase().includes(trimmedKeyword.toLowerCase())
        );
        setMyGroups(filtered);
      }
    }

    if (activeTab === "requests") {
      if (!trimmedKeyword) {
        setMessageRequests(messageRequestsBackup);
      } else {
        const filtered = messageRequestsBackup.filter((item) =>
          item.initiatorDetails.fullname
            .toLowerCase()
            .includes(trimmedKeyword.toLowerCase())
        );
        setMessageRequests(filtered);
      }
    }

    if (activeTab === "users") {
      if (!trimmedKeyword) {
        setDirectChats(directChatsBackup);
      } else {
        const filtered = directChatsBackup.filter((item) =>
          item.initiatorDetails.fullname
            .toLowerCase()
            .includes(trimmedKeyword.toLowerCase())
        );
        setDirectChats(filtered);
      }
    }
  };

  useEffect(() => {
    const userId = localStorageService.getItem("init_chat");
    if (userId && !isLoading) {
      const loadNewUer = async () => {
        setInitAPILoading(true);
        const stateUser = directChats.find(
          (item) =>
            item.initiatorDetails._id == userId ||
            item.recipientDetails._id == userId
        );

        if (!stateUser) {
          const reqData = {
            initiator_id: user._id,
            recipient_id: userId,
          };
          const token = localStorageService.getItem("accessToken");
          const res = await axiosInstance.post(
            `/direct-chat/init-conversation`,
            reqData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data.success && res.data.statusCode == 200) {
            await getSingleChats();

            setTimeout(() => {
              const data = directChatsRef.current.find(
                (item) =>
                  item.initiatorDetails._id == userId ||
                  item.recipientDetails._id == userId
              );

              console.log(data);

              getSingleChat(data._id);
              setSelectedUser(data);
              setActiveTab("users");
              setInitAPILoading(false);
            }, 2000);
          } else if (res.data.success && res.data.statusCode == 203) {
            await getMessageRequests();

            setTimeout(() => {
              const data = messageRequestsRef.current.find(
                (item) =>
                  item.initiatorDetails._id == userId ||
                  item.recipientDetails._id == userId
              );
              console.log(data);
              getSingleChat(data._id);
              setSelectedUser(data);
              setActiveTab("requests");
              setInitAPILoading(false);
            }, 2000);
          }
        } else {
          setSelectedGroup(null);
          setSelectedUser(stateUser);
          setActiveTab("users");
          setInitAPILoading(false);
        }

        localStorage.removeItem("init_chat");
      };

      loadNewUer();
    }
  }, [isLoading]);

  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [openNewAdminPopup, setOpenNewAdminPopup] = useState(false);
  const [leaveLoader, setLeaveLoader] = useState(false);

  const truncateText = (text, maxLength = 33) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getOtherUserDetails = async () => {
    const getOtherUser =
      selectedUser?.initiatorDetails?._id == user._id
        ? selectedUser?.recipientDetails
        : selectedUser?.initiatorDetails;
    console.log(getOtherUser);
    return getOtherUser;
  };

  const [otherUserDetails, setOtherUserDetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const getOtherUser =
        selectedUser?.initiatorDetails?._id === user._id
          ? selectedUser?.recipientDetails
          : selectedUser?.initiatorDetails;
      setOtherUserDetails(getOtherUser);
    };

    fetchUser();
  }, [selectedUser, user]);

  // Handle socket connection states more gracefully
  const [initialLoadTime, setInitialLoadTime] = useState(Date.now());
  const [showConnectionError, setShowConnectionError] = useState(false);

  useEffect(() => {
    // Set a timer to show connection error if socket doesn't connect within 10 seconds
    const timer = setTimeout(() => {
      if (!isConnected && isAvailable) {
        setShowConnectionError(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isConnected, isAvailable]);

  // If socket is not available (no token), wait briefly for token to become available
  if (!isAvailable && Date.now() - initialLoadTime < 3000) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Initializing chat...</span>
        </div>
      </div>
    );
  }

  // If socket is available but not connected, show a lighter loading state
  if (isAvailable && !isConnected && !showConnectionError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="flex items-center space-x-2 mb-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading the chats...</span>
        </div>
      </div>
    );
  }

  // If there's a connection error or socket is not available after waiting
  if (
    showConnectionError ||
    (!isAvailable && Date.now() - initialLoadTime >= 3000)
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Unable to connect to chat server</p>
          <CustomButton
            title="Retry Connection"
            onClick={() => {
              setShowConnectionError(false);
              setInitialLoadTime(Date.now());
              reconnect();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-[400px_1fr] bg-black text-white">
      {/* Sidebar */}
      <div className="bg-[#111] border-r border-gray-800 p-4 pb-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold mb-0">Chat</div>
          </div>

          {activeTab === "groups" && !showSearch && (
            <div
              onClick={() => setSelectGroupsOpen(true)}
              className="text-primary ms-auto mr-3 cursor-pointer font-semibold hover:text-white transition-all duration-300 text-sm flex items-center gap-2"
            >
              <Icon
                icon="f7:plus-app"
                style={{ width: "25px", height: "25px" }}
              />
              Create Group
            </div>
          )}

          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                filterList(e.target.value);
              }}
              className="bg-lightdark border border-gray-600 rounded-full px-4 py-2 text-sm text-white ms-auto"
            />
          )}

          <div
            onClick={() => {
              if (showSearch) {
                setShowSearch(false);
                setSearchText("");
                filterList(""); // Reset list on close
              } else {
                setShowSearch(true);
              }
            }}
            className={`bg-lightdark rounded-full p-2 cursor-pointer hover:bg-white hover:text-black ${
              activeTab === "groups" || showSearch ? "" : "ms-auto"
            }`}
          >
            <Icon
              icon={showSearch ? "ic:round-close" : "uil:search"}
              style={{ width: "20px", height: "20px" }}
            />
          </div>
        </div>

        <CustomTab
          activeTab={activeTab}
          onTabChange={setActiveTab}
          defaultValue="groups"
          tabs={[
            {
              value: "groups",
              label: "Groups Chat",
              content: (
                <ScrollArea className="h-[calc(100vh-230px)]">
                  <div className="text-white">
                    {myGroups.map((group: any, i: number) => {
                      const isActive =
                        selectedGroup?._id === group._id &&
                        activeTab === "groups";
                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200`}
                          onClick={() => {
                            // joinRoom(group._id);
                            if (selectedGroup?._id !== group._id) {
                              setSelectedGroup(group);
                              setNewMessage("");
                            }

                            setActiveTab("groups");
                          }}
                        >
                          <img
                            src={
                              group.group_picture_url || IMAGES.groupPlaceholder
                            }
                            alt={group.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />

                          <div className="flex-1 border-b border-gray-700 pb-3 mb-7">
                            <div className="flex justify-between items-center">
                              <h3
                                className={`font-normal mb-1 text-sm ${
                                  isActive ? "text-lime-400" : "text-white"
                                }`}
                                title={group.name}
                              >
                                {truncateText(group.name, 24)}
                              </h3>

                              <span className="text-xs text-grey">
                                {group.members.length}{" "}
                                {group.members.length === 1
                                  ? "Member"
                                  : "Members"}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="text-sm text-white truncate max-w-[80%]">
                                {group.latestMessage ? (
                                  <>
                                    {group.latestMessage.text &&
                                      truncateText(
                                        group.latestMessage.text,
                                        30
                                      )}
                                    {group.latestMessage.post_id &&
                                      "Shared a Post"}
                                    {group.latestMessage.workout_id &&
                                      "Shared a Workout"}
                                  </>
                                ) : (
                                  <span className="text-gray-400 italic">
                                    No messages yet
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!isLoading && myGroups.length === 0 && (
                      <NoDataPlaceholder />
                    )}
                  </div>
                </ScrollArea>
              ),
            },
            {
              value: "users",
              label: "Users Chat",
              content: (
                <ScrollArea className="h-[calc(100vh-230px)]">
                  <div className="text-white">
                    {directChats.map((singleChat) => {
                      const getOtherUser =
                        singleChat.initiatorDetails._id == user._id
                          ? singleChat.recipientDetails
                          : singleChat.initiatorDetails;

                      const selectedOtherUser =
                        selectedUser?.initiatorDetails._id == user._id
                          ? selectedUser?.recipientDetails
                          : selectedUser?.initiatorDetails;

                      const isActive =
                        selectedOtherUser?._id == getOtherUser._id;

                      return (
                        <div
                          key={singleChat._id}
                          onClick={() => {
                            setActiveTab("users");
                            if (selectedUser?._id !== singleChat._id) {
                              setSelectedUser(singleChat);
                              setNewMessage("");
                            }
                            // setSelectedChat(singleChat);
                            // setActiveTab("users");
                            // setActiveUserId(singleChat._id);
                            // setChatMessages(messages);
                          }}
                          className={`flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200`}
                        >
                          <img
                            src={
                              getOtherUser.profile_picture ||
                              IMAGES.placeholderAvatar
                            }
                            alt={getOtherUser.fullname}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 border-b border-gray-700 pb-3 mb-7">
                            <div className="flex justify-between items-center">
                              <h3
                                className={`font-semibold mb-1 text-sm ${
                                  isActive ? "text-lime-400" : "text-white"
                                }`}
                              >
                                {truncateText(getOtherUser.fullname)}{" "}
                              </h3>
                              <span className="text-xs text-grey">
                                {singleChat.last_message &&
                                  moment(
                                    singleChat.last_message.created_at
                                  ).fromNow()}
                              </span>
                            </div>
                            {/* <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400 truncate max-w-[80%]">
                                {singleChat.last_message &&
                                  singleChat.last_message.text}
                              </p>
                              {onlineUsers.includes(getOtherUser._id) && (
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                              )}
                            </div> */}

                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400 truncate max-w-[80%]">
                                {singleChat.last_message?.text ? (
                                  truncateText(
                                    singleChat.last_message?.text,
                                    30
                                  )
                                ) : (
                                  <span className="italic text-gray-500">
                                    No messages yet
                                  </span>
                                )}
                              </p>
                              {onlineUsers.includes(getOtherUser._id) && (
                                <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!isLoading && directChats.length === 0 && (
                      <NoDataPlaceholder />
                    )}
                  </div>
                </ScrollArea>
              ),
            },
            {
              value: "requests",
              label: `Requests (${messageRequests.length})`,
              content: (
                <ScrollArea className="h-[calc(100vh-230px)]">
                  <div className="text-white">
                    {messageRequests.map((request) => {
                      const getOtherUser =
                        request.initiatorDetails._id == user._id
                          ? request.recipientDetails
                          : request.initiatorDetails;

                      const selectedOtherUser =
                        selectedUser?.initiatorDetails._id == user._id
                          ? selectedUser?.recipientDetails
                          : selectedUser?.initiatorDetails;

                      const isActive =
                        selectedOtherUser?._id == getOtherUser._id;

                      return (
                        <div
                          key={request._id}
                          onClick={() => {
                            setSelectedGroup(null);
                            setActiveTab("requests");
                            setSelectedUser(request);
                            getSingleChat(request._id);

                            // setSelectedChat(request);

                            // setActiveUserId(request._id);
                            // setChatMessages(messages);
                          }}
                          className={`flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200`}
                        >
                          <img
                            src={
                              request.initiatorDetails.profile_picture ||
                              IMAGES.placeholderAvatar
                            }
                            alt={request.initiatorDetails.fullname}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 border-b border-gray-700 pb-3 mb-7">
                            <div className="flex justify-between items-center">
                              <h3
                                className={`font-semibold mb-1 text-sm ${
                                  isActive ? "text-lime-400" : "text-white"
                                }`}
                              >
                                {truncateText(
                                  request.initiatorDetails.fullname
                                )}{" "}
                              </h3>
                              <span className="text-xs text-grey">
                                {moment(request.message.created_at).fromNow()}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400 truncate max-w-[80%]">
                                {request?.message?.text ? (
                                  truncateText(request?.message?.text, 30)
                                ) : (
                                  <span className="italic text-gray-500">
                                    No messages yet
                                  </span>
                                )}
                              </p>
                              {onlineUsers.includes(getOtherUser._id) && (
                                <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                              )}
                            </div>

                            {/* <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400 truncate max-w-[80%]">
                                {request.message.text}
                              </p>
                              {request.online && (
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                              )}
                            </div> */}
                          </div>
                        </div>
                      );
                    })}

                    {!isLoading && messageRequests.length === 0 && (
                      <NoDataPlaceholder />
                    )}
                  </div>
                </ScrollArea>
              ),
            },
          ]}
        />
      </div>

      {(selectedGroup || selectedUser) && (
        <div className="flex flex-col h-full w-full">
          {/* Header */}

          <div className="border-b border-gray-800 p-4 font-semibold text-lg flex items-center gap-2 ">
            {activeTab === "groups" && selectedGroup && (
              <>
                <Avatar
                  className="w-12 h-12 cursor-pointer"
                  onClick={() => setGroupDetailsOpen(true)}
                >
                  <AvatarImage
                    src={
                      selectedGroup?.group_picture_url ||
                      IMAGES.groupPlaceholder
                    }
                  />
                  <AvatarFallback>{selectedGroup?.name}</AvatarFallback>
                </Avatar>
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() => setGroupDetailsOpen(true)}
                >
                  {selectedGroup?.name || "FitFam Unite"}
                  <span className="text-xs text-gray-400">
                    {selectedGroup.members.length}{" "}
                    {selectedGroup.members.length === 1 ? "Member" : "Members"}
                  </span>
                </div>
              </>
            )}

            {(activeTab === "users" || activeTab === "requests") &&
              selectedUser && (
                <>
                  {(() => {
                    const otherUser =
                      selectedUser.initiatorDetails._id === user._id
                        ? selectedUser.recipientDetails
                        : selectedUser.initiatorDetails;

                    return (
                      <>
                        <Avatar
                          className="w-12 h-12 cursor-pointer"
                          onClick={() => {
                            navigate("/user/profile", {
                              state: {
                                id: otherUser._id,
                              },
                            });
                          }}
                        >
                          <AvatarImage
                            src={
                              otherUser.profile_picture ||
                              IMAGES.placeholderAvatar
                            }
                          />
                          <AvatarFallback>
                            {otherUser.fullname ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="flex flex-col cursor-pointer"
                          onClick={() => {
                            navigate("/user/profile", {
                              state: {
                                id: otherUser._id,
                              },
                            });
                          }}
                        >
                          {otherUser.fullname}

                          {/* {onlineUsers.includes(otherUser._id) && "Online"} */}
                          <span className="text-xs text-gray-400">
                            {typingStatus == otherUser._id && "Typing..."}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}

            <div className="relative ms-auto">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <Link
                    to="#"
                    className="text-white font-semibold ms-auto hover:text-primary transition-all duration-300 text-sm flex items-center gap-2"
                  >
                    <Icon
                      icon="qlementine-icons:menu-dots-16"
                      style={{ width: "25px", height: "25px" }}
                    />
                  </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="bg-lightdark w-45 p-2 border-lightdark rounded-[12px]"
                  sideOffset={10}
                >
                  {activeTab === "groups" && (
                    <>
                      <DropdownMenuItem
                        className="text-white hover:opacity-80 mb-2"
                        onClick={() => {
                          getGroupDetails();
                          setGroupDetailsOpen(true);
                        }}
                      >
                        <Link to="#" className="flex items-center gap-2">
                          <img src={IMAGES.chaticon1} alt="View Details" /> View
                          Details
                        </Link>
                      </DropdownMenuItem>
                      {chatMessages.length > 0 && (
                        <DropdownMenuItem className="text-white hover:opacity-80 mb-2">
                          <Link
                            to="#"
                            className="flex items-center gap-2"
                            onClick={() => setClearChatPopup(true)}
                          >
                            <img src={IMAGES.chaticon2} alt="Clear Chat" />{" "}
                            Clear Chat
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem className="text-white hover:opacity-80 mb-2">
                        <Link
                          to="#"
                          onClick={() => {
                            if (
                              groupAdmin === user._id &&
                              selectedGroup.members.length > 1
                            ) {
                              setSelectedAdminId(null);
                              setOpenNewAdminPopup(true);
                            } else {
                              setLeaveGroup(true);
                            }

                            //  setLeaveGroup(true)
                          }}
                          className="flex items-center gap-2"
                        >
                          <img src={IMAGES.chaticon3} alt="Leave Group" /> Leave
                          Group
                        </Link>
                      </DropdownMenuItem>
                      {selectedGroup &&
                        selectedGroup.members.find(
                          (item) => item.user_id == user._id && item.is_admin
                        ) && (
                          <DropdownMenuItem className="text-white hover:opacity-80 mb-2">
                            <Link
                              to="#"
                              onClick={() => setDeleteGroup(true)}
                              className="flex items-center gap-2"
                            >
                              <img src={IMAGES.chaticon4} alt="Delete Group" />{" "}
                              Delete Group
                            </Link>
                          </DropdownMenuItem>
                        )}
                    </>
                  )}
                  {(activeTab === "users" || activeTab === "requests") && (
                    <>
                      {activeTab === "users" && (
                        <DropdownMenuItem
                          className="text-white hover:opacity-80 mb-2"
                          onClick={() => setClearChatPopup(true)}
                        >
                          <Link to="#" className="flex items-center gap-2">
                            <img src={IMAGES.clearchat} alt="View Details" />{" "}
                            Clear Chat
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem className="text-white hover:opacity-80 mb-2">
                        <Link
                          to="#"
                          className="flex items-center gap-2"
                          onClick={() => setBlockUserPopup(true)}
                        >
                          <img src={IMAGES.blockuser} alt="Clear Chat" />
                          Block User
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-white hover:opacity-80 mb-2">
                        <Link
                          to="#"
                          className="flex items-center gap-2"
                          onClick={() => setIsReport(true)}
                        >
                          <img src={IMAGES.reportuser} alt="Leave Group" />{" "}
                          Report User
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[calc(100vh-250px)] px-4 sm:px-6 py-4 space-y-4">
            {!chatLoader &&
              !groupChatLoader &&
              chatMessages &&
              chatMessages.map((msg: any, i: number) => (
                <div
                  key={i}
                  className={`flex mb-3 ${
                    msg.sender_id == user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg && msg.text && (
                    <div className="flex items-end gap-3">
                      {activeTab === "groups" && (
                        <>
                          {msg.sender_id != user._id && (
                            <Avatar className="w-8 h-8 relative bottom-5">
                              <AvatarImage
                                src={
                                  msg.sender?.profile_picture ||
                                  IMAGES.placeholderAvatar
                                }
                              />
                              <AvatarFallback>
                                {msg?.sender?.fullname}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </>
                      )}

                      <div>
                        <div
                          className={`bg-lightdark rounded-[22px] p-3 px-4 max-w-[90%] sm:max-w-md ${
                            msg.sender_id == user._id
                              ? "bg-lime-500 text-black rounded-br-none"
                              : "text-white rounded-bl-none"
                          }`}
                        >
                          {activeTab === "groups" ? (
                            <>
                              {msg.sender_id != user._id && (
                                <h3 className="text-sm font-semibold mb-2 text-green">
                                  {msg?.sender?.fullname}
                                </h3>
                              )}
                              <p className="text-sm mb-0 break-words overflow-wrap-anywhere">
                                {msg.text}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm mb-0 break-words overflow-wrap-anywhere">
                              {msg.text}
                            </p>
                          )}
                        </div>
                        <span
                          className={`block text-xs mt-1 text-grey font-normal ${
                            msg.sender_id == user._id
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {moment(msg.created_at).fromNow()}
                        </span>
                      </div>
                    </div>
                  )}

                  {msg.workout && (
                    <div className="flex justify-end items-end">
                      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4">
                        <WorkoutComponent
                          visibility={msg.workout.visibility}
                          is_draft={msg.workout.is_draft}
                          key={msg._id}
                          image={msg.workout.thumbnail}
                          title={msg.workout.title}
                          price={
                            msg.workout.access == "Paid"
                              ? `$${msg.workout.fees}`
                              : ""
                          }
                          duration={totalWorkoutDuration(msg.workout.exercises)}
                          weeks={`${msg.workout.max_week} week`}
                          onViewClick={() => {
                            setWorkoutDetails(msg.workout);
                            getWorkoutProgress(msg.workout._id);
                            setWorkoutOpen(true);
                          }}
                        />
                        {moment(msg.created_at).fromNow()}
                      </div>
                    </div>
                  )}

                  {msg.post && (
                    <div className="flex justify-end items-end">
                      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4">
                        <ProfilePostCard
                          key={msg._id}
                          item={{
                            ...msg.post,
                          }}
                          to={`/user/profile/${msg.sender_id}/post/${msg.post._id}`}
                        />
                        {moment(msg.created_at).fromNow()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            {(chatLoader || groupChatLoader) && (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin w-6 h-6 text-white" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {(activeTab === "groups" ||
            activeTab === "users" ||
            selectedUser?.request === "accept") && (
            <div className="p-4 border-t border-gray-800 flex items-center gap-3">
              <div className="flex items-center flex-1 relative">
                <Avatar className="w-7 h-7 absolute left-3">
                  <AvatarImage
                    src={user.profile_picture || IMAGES.placeholderAvatar}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Input
                  ref={messageInputRef}
                  placeholder="Type your message..."
                  value={newMessage}
                  // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  //   setNewMessage(e.target.value)
                  // }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewMessage(e.target.value);

                    if (activeTab === "requests" || activeTab === "users") {
                      const otherUser =
                        selectedUser.initiatorDetails._id === user._id
                          ? selectedUser.recipientDetails._id
                          : selectedUser.initiatorDetails._id;

                      if (socket && !isTypingRef.current) {
                        isTypingRef.current = true;

                        if (activeTab === "requests" || activeTab === "users") {
                          console.log("typing event fired");
                          socket.emit("typing", {
                            toUserId: otherUser,
                            conversation_id: selectedUser._id,
                          });
                        }
                      }

                      // Clear previous timer
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }

                      // Set stop_typing timer
                      typingTimeoutRef.current = setTimeout(() => {
                        isTypingRef.current = false;

                        if (socket) {
                          if (
                            activeTab === "requests" ||
                            activeTab === "users"
                          ) {
                            console.log("stop_typing");
                            socket.emit("stop_typing", {
                              toUserId: otherUser,
                              conversation_id: selectedUser._id,
                            });
                          }
                        }
                      }, 1500);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();

                      if (activeTab === "requests" || activeTab === "users") {
                        console.log("sendDirectMessage");
                        sendDirectMessage();
                      }
                      if (activeTab === "groups") {
                        sendGroupMessage();
                      }
                    }
                  }}
                  className="bg-[#222] h-12 rounded-full pl-13 text-white flex-1 border-none focus:outline-none"
                />
              </div>

              <Button
                onClick={() => {
                  if (activeTab === "requests" || activeTab === "users") {
                    sendDirectMessage();
                  }
                  if (activeTab === "groups") {
                    sendGroupMessage();
                  }

                  // if (!newMessage.trim()) return;
                  // const newMsg: Message = {
                  //   name: "Me",
                  //   msg: newMessage,
                  //   time: new Date().toLocaleTimeString([], {
                  //     hour: "2-digit",
                  //     minute: "2-digit",
                  //   }),
                  //   avatar: IMAGES.user3,
                  //   isUser: true,
                  //   usermessage: newMessage,
                  // };
                  // setChatMessages((prev) => [...prev, newMsg]);
                  // setNewMessage("");
                }}
                className="bg-lime-400 text-black rounded-full p-3 cursor-pointer w-11 h-11"
              >
                <img src={IMAGES.send1} alt="Send" className="w-9 h-9" />
              </Button>
            </div>
          )}

          {activeTab === "requests" && selectedUser?.request === "pending" && (
            <>
              {/* Message Input */}
              <div className="p-4 pt-0 flex items-center gap-3">
                <CustomButton
                  text={"Reject"}
                  type="button"
                  className="w-auto flex-1 bg-red text-white border-none"
                  onClick={() =>
                    !deleteRequestLoader && handleRequest("delete")
                  }
                />
                <CustomButton
                  text={"Accept"}
                  type="button"
                  onClick={() =>
                    !deleteRequestLoader && handleRequest("accept")
                  }
                  className="w-auto flex-1"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Create Group Drawer */}
      <DrawerSidebar
        title={"Create Group"}
        submitText={createGroupLoader ? "Creating..." : "Create Now"}
        cancelText="Cancel"
        onSubmit={!createGroupLoader && handleCreateGroup}
        open={selectGroupsOpen}
        setOpen={setSelectGroupsOpen}
        className="customWidthDrawer"
        showFooter={false}
        showCreateButton={true}
      >
        <div className="p-4">
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-23 h-23 rounded-full relative">
                <img
                  src={
                    groupImage
                      ? URL.createObjectURL(groupImage)
                      : IMAGES.placeholder
                  }
                  alt="Group"
                  className="w-full h-full object-cover rounded-full"
                />
                <div
                  className="absolute bottom-1 right-1 bg-lime-400 rounded-full p-1 cursor-pointer"
                  onClick={() =>
                    document.getElementById("group-image-upload")?.click()
                  }
                >
                  <Icon icon="uil:plus" color="black" className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            id="group-image-upload"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <TextInput
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            type="text"
            icon={<img src={IMAGES.people} alt="Group" className="w-5 h-5" />}
            className="mb-3"
          />
          <div className="flex items-center justify-between gap-2 mb-2 mt-7">
            <h2 className="text-white font-semibold text-sm">
              Select Users{" "}
              <span className="text-white">({selectedMembers.length})</span>
            </h2>
            <button
              className="text-lime-400 text-sm font-medium hover:underline cursor-pointer"
              onClick={() => {
                setSelectedMembers(followers.map((user) => user._id));
              }}
            >
              Select All
            </button>
          </div>
          <TextInput
            placeholder="Search by name..."
            value={searchGroups}
            onChange={(e: any) => setSearchGroups(e.target.value)}
            type="text"
            icon={<Icon icon="uil:search" color="white" className="w-5 h-5" />}
            className="mb-3"
          />
          <div className="mt-4 text-white">
            {followers.map((user) => (
              <label
                key={user._id}
                htmlFor={`group-${user._id}`}
                className="flex items-start gap-3 mb-4 w-full cursor-pointer relative"
              >
                <img
                  src={user.profile_picture || IMAGES.placeholderAvatar}
                  alt={user.fullname}
                  className="w-12 h-12 rounded-full"
                />
                <div className="border-b border-gray-600 pb-4 w-full">
                  <div className="flex justify-between items-center w-full gap-5">
                    <h3 className="text-white text-base font-semibold">
                      {user.fullname}
                    </h3>
                    <Checkbox
                      id={`group-${user._id}`}
                      className="cursor-pointer text-black border-grey hover:border-primary transition-colors"
                      checked={selectedMembers.includes(user._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMembers([...selectedMembers, user._id]);
                        } else {
                          setSelectedMembers(
                            selectedMembers.filter((id) => id !== user._id)
                          );
                        }
                      }}
                    />
                  </div>
                  <span className="text-grey text-sm font-medium">
                    {user.followerCount} Followers
                  </span>
                </div>
              </label>
            ))}
            {followers.length === 0 && <NoDataPlaceholder />}
          </div>
        </div>
      </DrawerSidebar>

      {/* Group Details Drawer */}
      {selectedGroup && (
        <DrawerSidebar
          title="Group Details"
          submitText="Done"
          cancelText="Cancel"
          onSubmit={() => console.log("Post Submitted")}
          open={groupDetailsOpen}
          setOpen={setGroupDetailsOpen}
          className="customWidthDrawer"
          showFooter={false}
          editProfile={groupAdmin == user._id}
          onEditProfile={() => {
            setEditGroupName(selectedGroup.name);
            setEditProfile(true);
          }}
        >
          <div className="p-4">
            <div className="flex flex-col justify-center items-center mb-3">
              <img
                src={selectedGroup.group_picture_url || IMAGES.groupPlaceholder}
                alt="Group"
                className="w-22 h-22 rounded-full mb-3"
              />
              <h3 className="text-white text-base font-semibold mb-0">
                {selectedGroup.name}
              </h3>
              <p className="text-gray-400 text-sm font-normal">
                {" "}
                {selectedGroup.members.length}{" "}
                {selectedGroup.members.length === 1 ? "Member" : "Members"}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-white font-semibold text-xs">Members</h2>
              {groupAdmin == user._id && (
                <button
                  className="text-lime-400 text-xs font-medium hover:underline cursor-pointer flex items-center gap-1"
                  onClick={() => {
                    getFollowers();
                    setAddNewMembersPopup(true);
                  }}
                >
                  <Icon
                    icon="f7:plus-app"
                    style={{ width: "22px", height: "22px" }}
                  />{" "}
                  Add Members
                </button>
              )}
            </div>
            <TextInput
              placeholder="Search by name..."
              value={searchGroups}
              onChange={(value: string) => setSearchGroups(value)}
              type="text"
              icon={
                <Icon icon="uil:search" color="white" className="w-5 h-5" />
              }
              className="mb-3"
            />
            <div className="mt-2 text-white">
              {selectedGroup.members.map((member) => (
                <div
                  key={member.user._id}
                  className="flex items-start  gap-3 w-full  py-2"
                >
                  {/* Profile Info */}
                  <img
                    src={
                      member.user.profile_picture || IMAGES.placeholderAvatar
                    }
                    alt={member.user.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                    onClick={() => {
                      navigate("/user/profile/", {
                        ...(member.user._id !== user._id && {
                          state: { id: member.user._id },
                        }),
                      });
                    }}
                  />
                  <div className="flex gap-3 items-start justify-between border-b border-gray-700 pb-4 flex-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-sm">
                          {member.user.fullname}
                        </h3>
                        {member.is_admin && (
                          <span className="text-xs text-lime-400 font-medium">
                            (Admin)
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {" "}
                        {member.user.follower_count}{" "}
                        {member.user.follower_count === 1
                          ? "Follower"
                          : "Followers"}
                      </p>
                    </div>
                    {!member.is_admin && groupAdmin === user._id && (
                      <button
                        className="border border-lime-400 cursor-pointer text-lime-400 text-xs font-normal px-4 py-[6px] rounded-full hover:bg-lime-400 hover:text-black transition"
                        onClick={() => {
                          setRemoveMemberId(member.user._id);
                          setRemoveMemberPopup(true);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Remove Button (not shown for Admin/You) */}
                </div>
              ))}

              {/* <div className="justify-center flex items-center mt-3">
              <div className="text-lime-400 underline hover:text-white text-center  text-sm font-medium hover:underline cursor-pointer ">
                View All
              </div>
            </div> */}
            </div>
          </div>
          <div className="w-full h-[7px] bg-lightdark"></div>
          <div className="p-4">
            <div className="space-y-5 text-red-500 font-normal text-sm mb-3">
              {/* Leave Group */}
              <button
                className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
                onClick={() => {
                  if (
                    groupAdmin === user._id &&
                    selectedGroup.members.length > 1
                  ) {
                    setSelectedAdminId(null);
                    setOpenNewAdminPopup(true);
                  } else {
                    setLeaveGroup(true);
                  }
                }}
              >
                <img
                  src={IMAGES.leavegroup}
                  alt="Leave Group"
                  className="w-5 h-5"
                />
                Leave Group
              </button>

              {/* Delete Group */}
              {selectedGroup.members.find(
                (item) => item.user_id == user._id && item.is_admin
              ) && (
                <button
                  className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
                  onClick={() => setDeleteGroup(true)}
                >
                  <img
                    src={IMAGES.deletegroup}
                    alt="Delete Group"
                    className="w-5 h-5"
                  />
                  Delete Group
                </button>
              )}
            </div>
          </div>
        </DrawerSidebar>
      )}

      {/* Workout Drawer */}
      <DrawerSidebarWorkoutDetails
        title=""
        submitText="Done"
        cancelText="Cancel"
        onSubmit={() => console.log("Post Submitted")}
        open={workoutOpen}
        setOpen={setWorkoutOpen}
        className="customWidthDrawer"
        showFooter={false}
      >
        <div
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(179deg, #161616 4.16%, rgba(22, 22, 22, 0.00) 40.1%, #161616 90.09%), 
                             linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), 
                             url("${workoutDetails.thumbnail}")`,
            backgroundPosition: "-58.02px -17.479px",
            backgroundSize: "117.955% 110.343%",
            height: "320px",
          }}
        ></div>
        <img
          src={IMAGES.arrowLeft}
          alt="arrowLeft"
          className="w-6 h-6 cursor-pointer absolute top-3 left-3 z-2"
          onClick={() => setWorkoutOpen(false)}
        />
        <div className="p-4 mt-[-50px] relative z-10">
          <h4 className="font-semibold text-sm mb-1 text-white">
            {workoutDetails?.title}
          </h4>

          <p className="text-sm text-white font-normal text-xs flex gap-1 items-center mb-4">
            <img src={IMAGES.calendar} alt="Calendar" className="w-4 h-5" />{" "}
            {workoutDetails?.max_week} weeks
            <img src={IMAGES.clock} alt="Calendar" className="w-4 h-4 ml-2" />
            {workoutDetails?.average_workout_duration_per_day} min{" "}
          </p>

          <p className="text-white text-sm font-normal mb-4">
            {workoutDetails?.caption}
          </p>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-white font-semibold text-sm">
              Participant{" "}
              <span className="text-xs font-normal">
                ({workoutProgress.length})
              </span>
            </h2>
            <button className="text-lime-400 text-sm font-medium hover:underline cursor-pointer">
              <Icon icon="uil:search" color="white" className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 text-white">
            {workoutProgress.map((user) => {
              const progress = user.progress_percent;
              const progressColor =
                progress === 100
                  ? "text-lime-400 border-lime-400"
                  : progress === 0
                  ? "text-white border-gray-500"
                  : progress <= 25
                  ? "text-red-500 border-red-500"
                  : "text-lime-400 border-lime-400";

              const arcColor =
                progress === 100
                  ? "stroke-lime-400"
                  : progress === 0
                  ? "stroke-gray-500"
                  : progress <= 25
                  ? "stroke-red-500"
                  : "stroke-lime-400";

              const statusText =
                progress === 100
                  ? {
                      label: "Completed",
                      className: "text-lime-400",
                      icon: "🟢",
                    }
                  : progress === 0
                  ? {
                      label: "Not Started",
                      className: "text-red-500",
                      icon: "",
                    }
                  : {
                      label: "In progress",
                      className: "text-gray-400",
                      icon: "",
                    };

              return (
                <div
                  key={user.id}
                  onClick={() =>
                    navigate("/user/chat/progress-details", {
                      state: {
                        ...user,
                        workout_title: workoutDetails.title,
                        workout_id: workoutDetails._id,
                      },
                    })
                  }
                  className="flex items-start justify-between w-full py-4 border-b border-gray-700 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        user.user.profile_picture || IMAGES.placeholderAvatar
                      }
                      alt={user.user.fullname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        {user.user.fullname}
                      </h3>
                      <p
                        className={`text-xs font-medium ${statusText.className}`}
                      >
                        {statusText.label}
                      </p>
                    </div>
                  </div>

                  {/* Circular progress */}
                  <div className="relative w-12 h-12">
                    <svg
                      className="w-12 h-12 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-800 stroke-current"
                        strokeWidth="2"
                        fill="none"
                        d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${arcColor} stroke-current`}
                        strokeWidth="2"
                        strokeDasharray={`${progress}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-[10px] font-semibold ${progressColor}`}
                      >
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DrawerSidebarWorkoutDetails>

      {/* Delete Group Modal */}
      {selectedGroup && (
        <CustomModal
          title="Delete Group"
          open={deleteGroup}
          setOpen={setDeleteGroup}
          onCancel={() => {
            !deleteGroupLoader && setDeleteGroup(false);
          }}
          onSubmit={() => {
            !deleteGroupLoader && handleDeleteGroup();
          }}
          submitText={deleteGroupLoader ? "Deleting..." : "Yes I'm Sure"}
          cancelText="Cancel"
          customButtonClass="!py-6"
          children={
            <div className="text-white text-center mb-3">
              <h3 className="font-semibold text-lg mb-1">Delete Group?</h3>
              <p className="text-grey text-sm">
                Are you sure you want to delete{" "}
                <span className="text-white">{selectedGroup.name}</span> group?
              </p>
            </div>
          }
        />
      )}

      {/* Leave Group Modal */}
      {selectedGroup && (
        <CustomModal
          title="Leave Group"
          open={leaveGroup}
          setOpen={setLeaveGroup}
          onCancel={() => {
            !deleteGroupLoader && setLeaveGroup(false);
          }}
          onSubmit={() => {
            !deleteGroupLoader && handleLeaveGroup();
          }}
          submitText={deleteGroupLoader ? "Leaving..." : "Yes I'm Sure"}
          cancelText="Cancel"
          customButtonClass="!py-6"
          children={
            <div className="text-white text-center mb-3">
              <h3 className="font-semibold text-lg mb-1">Leave Group?</h3>
              <p className="text-grey text-sm">
                Are you sure you want to leave{" "}
                <span className="text-white">{selectedGroup.name}</span> group?
              </p>
            </div>
          }
        />
      )}

      {/* Remove Member Modal */}
      <CustomModal
        title="Remove Member"
        open={removeMemberPopup}
        setOpen={setRemoveMemberPopup}
        onCancel={() => setRemoveMemberPopup(false)}
        onSubmit={() => {
          handleRemoveMember();
        }}
        submitText="Yes I'm Sure"
        cancelText="Cancel"
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Remove Member?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to remove this member
              {/* <span className="text-white">Hustlers</span> group? */}
            </p>
          </div>
        }
      />

      {/* Clear Chat Modal */}
      <CustomModal
        title="Clear Chat"
        open={clearChatPopup}
        setOpen={setClearChatPopup}
        onCancel={() => setClearChatPopup(false)}
        onSubmit={() => {
          if (selectedUser) handleClearUserChat();
          else handleClearGroupChat();
        }}
        submitText="Yes I'm Sure"
        cancelText="Cancel"
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Clear Chat?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to Clear Chat for this{" "}
              {selectedUser ? "user" : "group"}
              {/* <span className="text-white">Hustlers</span> group? */}
            </p>
          </div>
        }
      />

      {/* Block User Modal */}
      <CustomModal
        title="Block User"
        open={blockUserPopup}
        setOpen={setBlockUserPopup}
        onCancel={() => {
          !blockLoader && setBlockUserPopup(false);
        }}
        onSubmit={() => {
          !blockLoader && handleBlockUser();
        }}
        submitText={blockLoader ? "Blocking..." : "Yes I'm Sure"}
        cancelText="Cancel"
        customButtonClass="!py-6"
        children={
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-1">Block User?</h3>
            <p className="text-grey text-sm">
              Are you sure you want to block this user
              {/* <span className="text-white">Hustlers</span> group? */}
            </p>
          </div>
        }
      />

      {/* Edit Profile Modal */}

      {selectedGroup && (
        <CustomModal
          title="Edit Profile"
          open={editProfile}
          setOpen={setEditProfile}
          onCancel={() => {
            setEditProfile(false);
            setEditGroupImage(null);
          }}
          onSubmit={handleUpdateGroup}
          submitText={editLoading ? "Updating..." : "Update"}
          cancelText="Cancel"
          customButtonClass="!py-6"
        >
          <div className="text-white text-center mb-3">
            <h3 className="font-semibold text-lg mb-4">Edit Group</h3>
            <div className="items-center flex justify-center mb-5">
              <div className="relative w-25 h-25">
                <img
                  src={
                    editGroupImage
                      ? URL.createObjectURL(editGroupImage)
                      : selectedGroup.group_picture_url ||
                        IMAGES.groupPlaceholder
                  }
                  alt="Group"
                  className="w-full h-full rounded-full mb-3 object-cover border-2 border-white"
                />
                <label htmlFor="edit-group-image">
                  <img
                    src={IMAGES.editicon}
                    alt="Edit"
                    className="w-7 h-7 cursor-pointer absolute bottom-0 right-0 z-2"
                  />
                </label>
                <input
                  id="edit-group-image"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleEditImageChange}
                />
              </div>
            </div>
            <TextInput
              ref={editGroupNameRef}
              placeholder="Group Name"
              value={editGroupName}
              onChange={(e) => {
                setEditGroupName(e.target.value);
                if (editErrors.name)
                  setEditErrors((e) => ({ ...e, name: undefined }));
              }}
              type="text"
              icon={<img src={IMAGES.people} alt="Edit" className="w-5 h-5" />}
              className="mb-1"
              inputClassName="!bg-black"
              error={editErrors.name}
            />
          </div>
        </CustomModal>
      )}

      <AddMembersPopup
        open={addNewMembersPopup}
        setOpen={setAddNewMembersPopup}
        followers={followers}
        onSelect={setSelectedMembers}
        selectedMembers={selectedMembers}
        searchText={searchNewMembers}
        setSearchText={setSearchNewMembers}
        selectedGroup={selectedGroup}
        handleAddNewMembers={handleAddNewMembers}
      />

      <ChooseAdmin
        open={openNewAdminPopup}
        setOpen={setOpenNewAdminPopup}
        followers={followers}
        onSelect={setSelectedAdminId}
        selectedAdminId={selectedAdminId}
        searchText={searchNewMembers}
        setSearchText={setSearchNewMembers}
        selectedGroup={selectedGroup}
        userId={user._id}
        leaveLoader={leaveLoader}
        onSubmit={handleLeaveGroup}
      />

      {/* Report Drawer */}
      {/* <DrawerSidebar
        title="Report"
        submitText={isSubmitting ? "Submitting..." : "Submit"}
        cancelText="Cancel"
        onSubmit={handleReportSubmit}
        open={isReport}
        setOpen={setIsReport}
      >
        <div className="p-4">
          <h3 className="text-white text-md font-semibold mb-3">
            We Don’t tell {otherUserDetails?.fullname}.
          </h3>
          <div className="flex flex-col">
            <div className="space-y-6 mb-3">
              {reportOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setReportType(option)}
                  className="flex w-full cursor-pointer items-center justify-between text-left text-white text-sm font-normal focus:outline-none"
                >
                  {option}
                  <div className="w-5 h-5 ml-4">
                    <Icon
                      icon="radix-icons:radiobutton"
                      fontSize={20}
                      color={reportType === option ? "#94EB00" : "#666"}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
          {reportType === "Other" && (
            <CustomTextArea
              placeholder="Write your reason here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              icon={<Lines color="white" />}
              rows={1}
              className="resize-none overflow-hidden"
            />
          )}
        </div>
      </DrawerSidebar> */}

      {/* Report Drawer */}
      <Formik
        initialValues={initialValues}
        validationSchema={reportUserSchema}
        onSubmit={handleReportSubmit}
      >
        {({ values, setFieldValue, isSubmitting, handleSubmit, resetForm }) => (
          <Form>
            <DrawerSidebar
              title="Report"
              submitText={isSubmitting ? "Submitting..." : "Submit"}
              cancelText="Cancel"
              onSubmit={() =>
                document.getElementById("report-form-submit")?.click()
              }
              open={isReport}
              setOpen={setIsReport}
              onCancel={() => {
                resetForm();
                setIsReport(false);
              }}
            >
              <div className="p-4">
                <h3 className="text-white text-md font-semibold mb-3">
                  We don’t tell {otherUserDetails?.fullname}.
                </h3>

                <div className="flex flex-col">
                  <div className="space-y-6 mb-3">
                    {reportOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFieldValue("reportType", option)}
                        className="flex w-full cursor-pointer items-center justify-between text-left text-white text-sm font-normal focus:outline-none"
                      >
                        {option}
                        <div className="w-5 h-5 ml-4">
                          <Icon
                            icon="radix-icons:radiobutton"
                            fontSize={20}
                            color={
                              values.reportType === option ? "#94EB00" : "#666"
                            }
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="reportType"
                    component="div"
                    className="text-red-500 text-xs mb-2"
                  />
                </div>

                {values.reportType === "Other" && (
                  <div className="mt-4">
                    <Field name="reason">
                      {({ field }) => (
                        <CustomTextArea
                          {...field}
                          // onChange={(e) =>
                          //   setFieldValue("caption", e.target.value)
                          // }
                          placeholder="Write your reason here..."
                          icon={<Lines color="white" />}
                          error={null}
                          rows={1}
                          className="resize-none overflow-hidden"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="reason"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="hidden"
                  id="report-form-submit"
                  disabled={isSubmitting}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Submit
                </button>
              </div>
            </DrawerSidebar>
          </Form>
        )}
      </Formik>

      {(isLoading || initAPILoading) && <FullScreenLoader />}
      {deleteRequestLoader && <FullScreenLoader />}
    </div>
  );
};

export default GroupChatUI;
