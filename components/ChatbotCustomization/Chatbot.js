import React, { useState, useRef, useEffect } from "react";
import ChatbotWindow from "./ChatbotWindow";
import ColorPicker from "./ColorPicker";
import { getRequest, patchRequest } from "../../utils/api";
import { useRouter } from "next/router";

const Chatbot = ({ setIsImagesChanged }) => {
  const [isChatbotWindowOpen, setIsChatbotWindowOpen] = useState(true);
  const [chatbotData, setChatbotData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log(id, "getId");
  useEffect(() => {
    const chatDatastoken = localStorage.getItem("token");
    // console.log(chatDatas,'chatDatas');
    // setChatbotData(JSON.parse(chatDatas));

    const fetchChatbots = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (id) {
          const response = await getRequest(
            `/v1/chatbots/${id}`,
            chatDatastoken
          );
          if (response.status === "success") {
            setChatbotData(response.results);
          } else {
            setError("Error fetching chatbots");
          }
        }
      } catch (error) {
        setError("Error fetching chatbots");
      }

      setIsLoading(false);
    };

    fetchChatbots();
  }, [id]);

  return (
    <>
      {!isLoading && chatbotData && (
        <ChatCustomization
          setIsImagesChanged={setIsImagesChanged}
          chatData={chatbotData}
          chatbotId={id}
        />
      )}
    </>
  );
};

const ChatCustomization = ({ setIsImagesChanged, chatData, chatbotId }) => {
  const [name, setName] = useState(chatData.bot_name);
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [welcomeMessage, setWelcomeMessage] = useState(
    chatData.bot_welcome_message
  );
  const [isMessageEditable, setIsMessageEditable] = useState(false);
  const [editedMessage, setEditedMessage] = useState(welcomeMessage);
  const [chatMessageColor, setChatMessageColor] = useState("#000"); // Initial color state for ColorPicker 1
  const [userMessageColor, setUserMessageColor] = useState("#FFF"); // Initial color state for ColorPicker 2
  const [chatbotIcon, setChatbotIcon] = useState(chatData.popup_picture);
  const [chatbotLogo, setChatbotLogo] = useState(chatData.bot_picture);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [chatBotToken, setChatBotToken] = useState("");
  const form = useRef();

  //   const base64ToBlob = (base64String, contentType = 'image/png') => {
  //   const byteCharacters = atob(base64String);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);

  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }

  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   return new Blob(byteArrays, { type: contentType });
  // };

  // const handleIconUpload = (event) => {
  //   setIsUploadingIcon(true);
  //   const file = event.target.files[0];

  //   if (file.type.startsWith('image/')) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const img = new Image();
  //       img.onload = () => {
  //         if (img.width === img.height) {
  //           setChatbotIcon(reader.result);
  //           setIsImagesChanged(true);
  //           localStorage.setItem('chatbot_icon', reader.result);
  //         } else {
  //           alert('Image must be square (height and width should be same, kindly crop to upload)');
  //         }
  //       };
  //       img.src = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     alert('Only images are allowed');
  //   }
  //   setIsUploadingIcon(false);
  // };
  const handleIconUpload = (event) => {
    setIsUploadingIcon(true);
    const file = event.target.files[0];
    console.log(URL.createObjectURL(  
      event.target.files[0]));
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        // Code to handle image loading and validation
        console.log("File loaded successfully!");
        const uploadedIcon = reader.result; // Get the uploaded icon data
        setChatbotIcon(uploadedIcon); // Set the chatbotIcon state with the uploaded icon data
        setIsImagesChanged(true);
        localStorage.setItem("chatbot_icon", uploadedIcon);
        setIsUploadingIcon(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
      setIsUploadingIcon(false);
    }
  };

  const handleLogoUpload = (event) => {
    setIsUploadingLogo(true);
    const file = event.target.files[0];
    console.log(file, "file");
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width === img.height) {
            setChatbotLogo(reader.result);
            setIsImagesChanged(true);
            localStorage.setItem("chatbot_logo", reader.result);
          } else {
            alert(
              "Image must be square (height and width should be same, kindly crop to upload)"
            );
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only images are allowed");
    }
    setIsUploadingLogo(false);
  };

  // Function to handle color change for ColorPicker 1
  const handleColorChange1 = (selectedColor) => {
    setChatMessageColor(selectedColor.hex);
    localStorage.setItem("chatbotColor", selectedColor.hex);
  };

  // Function to handle color change for ColorPicker 2
  const handleColorChange2 = (selectedColor) => {
    setUserMessageColor(selectedColor.hex);
    localStorage.setItem("chatuserColor", selectedColor.hex);
  };

  // Function to handle edit button click

  const handleNameInputChange = (event) => {
    setEditedName(event.target.value);
  };

  const handleEditNameClick = () => {
    if (isNameEditable) {
      setName(editedName);
    }
    setIsNameEditable(!isNameEditable);
  };

  // Function to handle input change

  const handleEditMessageClick = () => {
    if (isMessageEditable) {
      setWelcomeMessage(editedMessage);
    }
    setIsMessageEditable(!isMessageEditable);
  };

  // Function to handle input change
  const handleMessageInputChange = (event) => {
    setEditedMessage(event.target.value);
  };

  useEffect(() => {
    const chatToken = localStorage.getItem("token");
    setChatBotToken(chatToken);
  }, []);

  const handleSave = async (e) => {
    console.log(e.target[0].value, "value1", form.current);
    e.preventDefault();
    // const payload = {
    //   bot_name: editedName, // Use the editedName state variable for bot name
    //   bot_welcome_message: editedMessage, // Use the editedMessage state variable for welcome message
    //   bot_chat_color: chatMessageColor, // Use the chatMessageColor state variable for chatbot message color
    //   user_chat_color: userMessageColor, // Use the userMessageColor state variable for user message color
    //   popup_picture: chatbotIcon, // Use the chatbotIcon state variable for chatbot icon
    //   bot_picture: chatbotLogo, // Use the chatbotLogo state variable for chatbot logo
    //    Add any additional fields as  needed
    // };

    //   const response = await patchRequest(
    //     "/v1/chatbots/",
    //     formData,
    //     chatBotToken,
    //     chatbotId
    //   );
    //   if (response.status === "success") {
    //     localStorage.setItem(
    //       "current_chatbot",
    //       JSON.stringify(response.results)
    //     );
    //     alert("successfully submitted");
    //   }
    // } catch (error) {
    //   console.error("Error saving the chatbot data:", error);
    // }
  };

  return (
    <div className="chat-customization">
      {/* Chatbot icon */}
      <form encType="multipart/form-data" onSubmit={handleSave} ref={form}>
        <div className="chatbot-icon">
          <img
            name="uploadIcon"
            src={chatbotIcon}
            style={{ borderRadius: "50%" }}
            alt="Chatbot Icon"
          />
        </div>
        <button
          name="iconButton"
          className="upload-icon-button"
          onClick={() => document.getElementById("icon-upload").click()}
        >
          {isUploadingIcon ? "Uploading..." : "Upload Icon"}
        </button>
        <input
          name="iconInput"
          id="icon-upload"
          type="file"
          accept="image/*"
          onChange={handleIconUpload}
          style={{ display: "none" }}
        />

        {/* CustomizeName div */}
        <div className="customize-name">
          {/* Label */}
          <div className="label">
            <b>Name</b>
          </div>

          {/* Name input field and edit button */}
          <div className="name-edit">
            <input
              name="nameInput"
              type="text"
              value={isNameEditable ? editedName : chatData?.bot_name}
              disabled={!isNameEditable}
              onChange={handleNameInputChange}
            />
            <button
              name="editButton"
              className="chatbot-edit-btn"
              onClick={handleEditNameClick}
            >
              {isNameEditable ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="customize-message">
          {/* Label */}
          <div className="label">
            <b>Welcome Message</b>
          </div>

          {/* Name input field and edit button */}
          <div className="message-edit">
            <input
              name="messageEdit"
              type="text"
              value={
                isMessageEditable
                  ? editedMessage
                  : chatData?.bot_welcome_message
              }
              disabled={!isMessageEditable}
              onChange={handleMessageInputChange}
            />
            <button
              className="chatbot-edit-btn"
              onClick={handleEditMessageClick}
            >
              {isMessageEditable ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="chatbot-logo">
          <img
            name="chatLogo"
            src={chatbotLogo}
            style={{ borderRadius: "50%" }}
            alt="Chatbot Logo"
          />
        </div>

        {/* Upload icon button */}
        <button
          className="upload-logo-button"
          onClick={() => document.getElementById("logo-upload").click()}
        >
          {isUploadingLogo ? "Uploading" : "Upload Logo"}
        </button>
        <input
          name="logoUploadInput"
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          style={{ display: "none" }}
        />

        <div className="customize-chatbot-message-color">
          <ColorPicker
            initialColor={
              chatMessageColor ? chatMessageColor : chatData.bot_chat_color
            }
            labelText="Chatbot Message Color"
            onColorChange={handleColorChange1}
          />
          <ColorPicker
            initialColor={
              userMessageColor ? userMessageColor : chatData.user_chat_color
            }
            labelText="User Message Color"
            onColorChange={handleColorChange2}
          />
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
