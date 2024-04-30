import { useState,useEffect } from "react";
import Fab from "@mui/material/Fab";
import { Avatar } from "@mui/material";
import Container from "./Container";

const FloatingButton = ({chatbot_id, isImagesChanged, setIsImagesChanged}) => {
  const [containerVisible, setContainerVisible] = useState(false);
  const [themeData, setThemeData] = useState(null);
  const { popup_picture } = themeData?.results || {};
  const [localLogo, setLocalLogo] = useState(themeData?.results);
  const [storedIcon, setStoredIcon] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
           `http://stanging-backend-chatbot-env.eba-xpae3fqu.ap-southeast-1.elasticbeanstalk.com/api/v1/chatbot-customizations/${chatbot_id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setThemeData(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isImagesChanged){
      if (typeof window !== 'undefined') {
        const storedLogo = localStorage.getItem('chatbot_logo');
        if (storedLogo) {
          setLocalLogo(storedLogo);
        }
      }
      setIsImagesChanged(false);
    }
    else {
      fetchData();
    }
  }, [chatbot_id, isImagesChanged]);

  useEffect(() => {
    const localIcon = localStorage.getItem('chatbot_icon');
    if(localIcon) {
      setStoredIcon(localIcon);
    }
  })

  const toggleContainer = () => {
    setContainerVisible((prevVisible) => !prevVisible);
  };

  const handleClose = () => {
    setContainerVisible(false);
  };

  return (
    <div>
      <Container isOpen={containerVisible} onClose={handleClose} themeData={themeData} storedIcon={storedIcon}/>
      <div className="floating-button">
        <Fab
          style={{ width: "60px", height: "60px", position: "relative" }}
          aria-label="add"
          onClick={toggleContainer}
        >
          <Avatar
            style={{ width: "60px", height: "60px" }}
            alt="FloatingAvatar"
            src={localLogo}
          />
        </Fab>
      </div>
    </div>
  );
};

export default FloatingButton;
