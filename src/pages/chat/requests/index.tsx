import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { IMAGES } from "@/contants/images";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "@/components/customcomponents/CustomButton";

interface User {
  id: string;
  name: string;
  image: string;
  time: string;
  message: string;
  online: boolean;
}

interface Message {
  name: string;
  msg: string;
  time: string;
  avatar: string;
  isUser: boolean;
  usermessage: string;
}

interface Chat {
  name: string;
  image?: string;
  img?: string;
  id?: string;
}

const RequestsUser = () => {
  const messages: Message[] = [
    {
      name: "Patrick Roberts",
      msg: "Don't forget tomorrow's sessio...",
      time: "10:30 am",
      avatar: IMAGES.user1,
      isUser: false,
      usermessage: "Hey Buddy!",
    },
  ];

  const initialUsers: User[] = [
    {
      id: "1",
      name: "Alley Park",
      image: IMAGES.user1,
      time: "Just now",
      message: "Sure, I will join👍",
      online: true,
    },
    {
      id: "2",
      name: "Richard",
      image: IMAGES.user2,
      time: "1h",
      message: "Thanks, and sure! Tomorrow is...",
      online: true,
    },
    {
      id: "3",
      name: "Simran Gill",
      image: IMAGES.user3,
      time: "4h",
      message: "This is great feedback, I have t...",
      online: false,
    },
    {
      id: "4",
      name: "Alice Grey",
      image: IMAGES.user4,
      time: "23h",
      message: "Will it work for you?",
      online: false,
    },
    {
      id: "5",
      name: "Mack Jorden",
      image: IMAGES.user5,
      time: "Yesterday",
      message: "Awesome job at that presentation...",
      online: true,
    },
  ];

  const [users] = useState<User[]>(initialUsers);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState<string>("groups");
  const [chatMessages, setChatMessages] = useState<Message[]>(messages);

  useEffect(() => {
    document.body.classList.add("custom-override");
    return () => document.body.classList.remove("custom-override");
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:grid md:grid-cols-[400px_1fr] bg-black text-white">
      {/* Sidebar */}
      <div className="bg-[#111] border-r border-gray-800 p-4 pb-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="text-lg font-bold mb-0 cursor-pointer flex items-center gap-1"
              onClick={() => navigate("/user/chat")}
            >
              <Icon
                icon="uil:arrow-left"
                style={{ width: "30px", height: "30px" }}
              />{" "}
              Requests
            </div>
          </div>
          <div
            className={`bg-lightdark rounded-full p-2 cursor-pointer hover:bg-white hover:text-black ms-auto`}
          >
            <Icon icon="uil:search" style={{ width: "20px", height: "20px" }} />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-230px)]">
          <div className="text-white mt-3">
            {users.map((user) => {
              const isActive =
                selectedChat?.id === user.id && activeTab === "users";

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    setSelectedChat(user);
                    setActiveTab("users");
                    setChatMessages(messages);
                  }}
                  className={`flex items-start gap-3  cursor-pointer`}
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 border-b border-gray-700 pb-3 mb-7">
                    <div className="flex justify-between items-center">
                      <h3
                        className={`font-semibold mb-1 text-sm flex-1 pr-2 ${
                          isActive ? "text-lime-400" : "text-white"
                        }`}
                      >
                        {user.name}
                      </h3>
                      <span className="text-xs text-grey flex-shrink-0">
                        {user.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400 truncate max-w-[80%]">
                        {user.message}
                      </p>
                      {user.online && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-full w-full">
        {/* Header */}

        <div className="border-b border-gray-800 p-4 font-semibold text-lg flex items-center gap-2 ">
          <Avatar className="w-12 h-12 cursor-pointer">
            <AvatarImage
              src={selectedChat?.image || selectedChat?.img || IMAGES.user1}
            />
            <AvatarFallback>{selectedChat?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col cursor-pointer">
            {selectedChat?.name || "FitFam Unite"}
            <span className="text-xs text-gray-400">526 Members</span>
          </div>
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
                <DropdownMenuItem className="text-white hover:opacity-80 mb-2">
                  <Link to="#" className="flex items-center gap-2">
                    <img src={IMAGES.blockuser} alt="View Details" /> Block User
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-white hover:opacity-80 mb-2">
                  <Link to="#" className="flex items-center gap-2">
                    <img src={IMAGES.reportuser} alt="Delete Group" /> Report
                    User
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[calc(100vh-250px)] px-4 sm:px-6 py-4 space-y-4">
          {chatMessages.map((msg: Message, i: number) => (
            <div
              key={i}
              className={`flex mb-3 ${
                msg.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end gap-3">
                <div>
                  <div
                    className={`bg-lightdark rounded-[22px] p-3 px-4 max-w-[90%] sm:max-w-md ${
                      msg.isUser
                        ? "bg-lime-500 text-black rounded-br-none"
                        : "text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm mb-0">{msg.usermessage}</p>
                  </div>
                  <span
                    className={`block text-xs mt-1 text-grey font-normal ${
                      msg.isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 pt-0 flex items-center gap-3">
          <CustomButton
            text="Delete"
            type="button"
            className="w-auto flex-1 bg-red text-white border-none"
          />
          <CustomButton
            text="Accept"
            type="button"
            onClick={() => navigate("/user/chat")}
            className="w-auto flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default RequestsUser;
