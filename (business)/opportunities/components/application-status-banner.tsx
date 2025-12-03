type ApplicationStatus = "awaiting-review" | "hired" | "not-hired";

interface ApplicationStatusBannerProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBanner({
  status,
}: ApplicationStatusBannerProps) {
  const statusConfig = {
    "awaiting-review": {
      bgColor: "#FFFBEA",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.37563 3C8.16172 3.07993 7.95135 3.16712 7.74481 3.26126M20.7176 16.3011C20.8198 16.0799 20.914 15.8542 20.9999 15.6245M18.4987 19.3647C18.6704 19.2044 18.8364 19.0381 18.9962 18.866M15.2688 21.3723C15.4629 21.2991 15.654 21.22 15.842 21.1351M12.1559 21.9939C11.925 22.0019 11.6925 22.0019 11.4615 21.9939M7.7872 21.1404C7.968 21.2217 8.15172 21.2978 8.33814 21.3683M4.67244 18.9208C4.80913 19.0657 4.95018 19.2064 5.09539 19.3428M2.63259 15.6645C2.70747 15.8622 2.78856 16.0569 2.87561 16.2483M2.00486 12.5053C1.99837 12.2972 1.99839 12.0878 2.00486 11.8794M2.62534 8.73714C2.6989 8.54165 2.77853 8.34913 2.86399 8.1598M4.65591 5.47923C4.80057 5.32514 4.95014 5.17573 5.10439 5.03124"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5M13.5 12H16M12 10.5V6"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M22 12C22 6.47715 17.5228 2 12 2"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      message: "Awaiting Review From Employer",
    },
    hired: {
      bgColor: "#ECFFEA",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 13.3333C3 13.3333 4.5 14 6.5 17C6.5 17 6.78485 16.5192 7.32133 15.7526M17 6C14.7085 7.14577 12.3119 9.55181 10.3879 11.8223"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 13.3333C8 13.3333 9.5 14 11.5 17C11.5 17 17 8.5 22 6"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      message: "You have been hired",
    },
    "not-hired": {
      bgColor: "#FFEAEA",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 17C8.91212 15.7856 10.3643 15 12 15C13.6357 15 15.0879 15.7856 16 17"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.00897 9H8M16 9H15.991"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      message: "Sorry, this opportunity has been filled",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className="flex items-center justify-center gap-2 py-4 px-10 rounded-b-[16px] border border-[#E1E4EA] border-t-0"
      style={{ backgroundColor: config.bgColor }}
    >
      <div className="flex items-center gap-2">
        {config.icon}
        <span className="text-[14px] font-medium font-inter-tight text-black text-center leading-[14.7px]">
          {config.message}
        </span>
      </div>
    </div>
  );
}
