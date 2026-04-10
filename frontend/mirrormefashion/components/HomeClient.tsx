// app/components/HomeClient.tsx
"use client";

import React, { useEffect, useReducer, useRef, useMemo } from "react";
import Navigation from "@/components/navigation";
import MobileHeroSection from "@/components/mobile-hero-section";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import CustomHorizontalScrollbar from "@/components/custom-horizontal-scrollbar";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import ProfessionalSection from "@/components/professional-section";
import RetailerSection from "@/components/retailer-section";
import AdvertiserSection from "@/components/advertiser-section";
import ChatSection from "@/components/chat-section";
import BodyModelerSection from "@/components/body-modeler-section";
import RegistrationSection from "@/components/registration-section";


type Props = {
  products: any[];
};

type State = {
  currentSection: string;
  isMobile: boolean;
  userType: string;
  userResponses: any | null;
  showBodyModeler: boolean;
  showRegistration: boolean;
};

type Action =
  | { type: "setCurrentSection"; payload: string }
  | { type: "setIsMobile"; payload: boolean }
  | { type: "setUserType"; payload: string }
  | { type: "setUserResponses"; payload: any | null }
  | { type: "setShowBodyModeler"; payload: boolean }
  | { type: "setShowRegistration"; payload: boolean }
  | { type: "reset" };

const initialState: State = {
  currentSection: "hero",
  isMobile: false,
  userType: "",
  userResponses: null,
  showBodyModeler: false,
  showRegistration: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setCurrentSection":
      return { ...state, currentSection: action.payload };
    case "setIsMobile":
      return { ...state, isMobile: action.payload };
    case "setUserType":
      return { ...state, userType: action.payload };
    case "setUserResponses":
      return { ...state, userResponses: action.payload };
    case "setShowBodyModeler":
      return { ...state, showBodyModeler: action.payload };
    case "setShowRegistration":
      return { ...state, showRegistration: action.payload };
    case "reset":
      return { ...initialState };
    default:
      return state;
  }
}

export default function HomeClient({ products }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Derived data memoized
  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  // Helper setters so child components can still call the same 'set...' functions
  const setCurrentSection = (section: string) =>
    dispatch({ type: "setCurrentSection", payload: section });
  const setIsMobile = (value: boolean) =>
    dispatch({ type: "setIsMobile", payload: value });
  const setUserType = (t: string) => dispatch({ type: "setUserType", payload: t });

  // Keep the same names and behaviors as your original code (handlers unchanged).
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Horizontal scroll and keyboard/touch handling (keeps original behavior)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || state.isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = (e.deltaY || e.deltaX) as number;
      container.scrollBy({
        left: scrollAmount * 2,
        behavior: "smooth",
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!container) return;
      const sectionWidth = window.innerWidth;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          container.scrollBy({ left: -sectionWidth, behavior: "smooth" });
          break;
        case "ArrowRight":
          e.preventDefault();
          container.scrollBy({ left: sectionWidth, behavior: "smooth" });
          break;
      }
    };

    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      if (!isScrolling) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          isScrolling = true;
          e.preventDefault();
        } else {
          return;
        }
      }

      if (isScrolling) {
        e.preventDefault();
        container.scrollLeft += diffX * 0.5;
        startX = currentX;
      }
    };

    const handleTouchEnd = () => {
      startX = 0;
      startY = 0;
      isScrolling = false;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [state.isMobile]);

  const scrollToSection = (sectionId: string) => {
    if (state.isMobile) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const section = document.getElementById(sectionId);
      if (section && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const sectionIndex = Array.from(container.children).indexOf(section);
        const scrollPosition = sectionIndex * window.innerWidth;
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const handleUserTypeSelection = () => {
    if (!state.userType) {
      alert("Please select a user type");
      return;
    }

    switch (state.userType) {
      case "stylist":
      case "blogger":
      case "photographer":
      case "shopper":
      case "influencer":
        setCurrentSection("chat");
        setTimeout(() => scrollToSection("sopiaChatSection"), 500);
        break;
      case "retailer":
        setCurrentSection("retailer");
        setTimeout(() => scrollToSection("retailerSection"), 500);
        break;
      case "advertiser":
        setCurrentSection("advertiser");
        setTimeout(() => scrollToSection("advertiserSection"), 500);
        break;
      default:
        setCurrentSection("professional");
    }
  };

  const handleChatbotComplete = (responses: any) => {
    dispatch({ type: "setUserResponses", payload: responses });
    dispatch({ type: "setShowBodyModeler", payload: true });
    setCurrentSection("bodyModeler");
    setTimeout(() => scrollToSection("bodyModelerSection"), 500);
  };

  const handleChatbotReset = () => {
    // Reset all states when chatbot is reset
    dispatch({ type: "setUserResponses", payload: null });
    dispatch({ type: "setShowBodyModeler", payload: false });
    dispatch({ type: "setShowRegistration", payload: false });
    setCurrentSection("chat");
  };





// when body modeler completes
const handleBodyModelerComplete = (bodyData: any) => {
  dispatch({
    type: "setUserResponses",
    payload: { ...state.userResponses, ...bodyData }, // ✅ merge chatbot + body modeler data
  });
  dispatch({ type: "setShowRegistration", payload: true });
  setCurrentSection("registration");
  setTimeout(() => scrollToSection("registrationSection"), 500);
};

const handleRegistrationSubmit = async (formData: any) => {
  console.log("Registration submitted:", formData);

  try {
    // Call Next.js proxy API instead of HTTP backend
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    const contentType = response.headers.get("content-type") || "";
    let data: any = null;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn("Backend returned non-JSON response:", text);
      data = { status: false, message: text || "No response from server" };
    }

    if (response.ok && data.status) {
      alert("🎉 Welcome! Your account has been created successfully!");
      console.log("Registered user:", data.user);

      // Save token if backend returns it
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Optional: auto-login the user using UserContext login
      // await login(formData.email, formData.password);

    } else {
      alert("⚠️ Registration failed: " + (data.message || JSON.stringify(data.errors)));
      console.error("Registration errors:", data.errors || data.message);
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Something went wrong. Please try again later.");
  }
};



  return (
    <div className="overflow-hidden h-screen">
      <Navigation scrollToSection={scrollToSection}  />

      <div className="h-[calc(100vh)]">
        {/* Mobile-First Native App Design */}
        {state.isMobile ? (
          <>
            {/* Mobile sections with vertical scroll */}
            <div className="h-full overflow-y-auto pb-0.5 pt-1">
              <MobileHeroSection onSectionChange={handleSectionChange} />

                 <HowItWorksSection onSectionChange={setCurrentSection} scrollToSection={scrollToSection} />
         

              {state.currentSection === "professional" && (
                <ProfessionalSection
                  isMobile={state.isMobile}
                  currentSection={state.currentSection}
                  userType={state.userType}
                  setUserType={setUserType}
                  handleUserTypeSelection={handleUserTypeSelection}
                />
              )}

              {state.currentSection === "retailer" && <RetailerSection isMobile={state.isMobile} />}

              {state.currentSection === "advertiser" && (
                <AdvertiserSection isMobile={state.isMobile} />
              )}

              {state.currentSection === "chat" && (
                <ChatSection
                  isMobile={state.isMobile}
                  handleChatbotComplete={handleChatbotComplete}
                  handleChatbotReset={handleChatbotReset}
                />
              )}

              {state.showBodyModeler && (
                <BodyModelerSection
                  isMobile={state.isMobile}
                  userResponses={state.userResponses}
                  handleBodyModelerComplete={handleBodyModelerComplete}
                />
              )}

              {state.showRegistration && (
                <RegistrationSection
                  isMobile={state.isMobile}
                  userResponses={state.userResponses}
                  handleRegistrationSubmit={handleRegistrationSubmit}
                />
              )}
            </div>

            {/* Native Mobile Bottom Navigation */}
            <MobileBottomNav currentSection={state.currentSection} onSectionChange={handleSectionChange} />
          </>
        ) : (
          <>
            {/* Desktop sections with horizontal scroll */}
            <div ref={scrollContainerRef} className="flex overflow-x-hidden snap-x snap-mandatory h-full">
              <HeroSection scrollToSection={scrollToSection} />

              <HowItWorksSection onSectionChange={setCurrentSection} scrollToSection={scrollToSection} />

              

              {state.currentSection === "professional" && (
                <ProfessionalSection
                  isMobile={state.isMobile}
                  currentSection={state.currentSection}
                  userType={state.userType}
                  setUserType={setUserType}
                  handleUserTypeSelection={handleUserTypeSelection}
                />
              )}

              {state.currentSection === "retailer" && <RetailerSection isMobile={state.isMobile} />}

              {state.currentSection === "advertiser" && <AdvertiserSection isMobile={state.isMobile} />}

              {state.currentSection === "chat" && (
                <ChatSection
                  isMobile={state.isMobile}
                  handleChatbotComplete={handleChatbotComplete}
                  handleChatbotReset={handleChatbotReset}
                />
              )}

              {state.showBodyModeler && (
                <BodyModelerSection
                  isMobile={state.isMobile}
                  userResponses={state.userResponses}
                  handleBodyModelerComplete={handleBodyModelerComplete}
                />
              )}

              {state.showRegistration && (
                <RegistrationSection
                  isMobile={state.isMobile}
                  userResponses={state.userResponses}
                  handleRegistrationSubmit={handleRegistrationSubmit}
                />
              )}
            </div>
            <CustomHorizontalScrollbar scrollContainerRef={scrollContainerRef} />
          </>
        )}
      </div>
    </div>
  );
}
