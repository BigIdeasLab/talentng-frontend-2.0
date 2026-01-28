"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { ProfileSwitcher } from "../ProfileSwitcher";

interface SidebarProps {
  activeItem?: string;
  onItemSelect?: (item: string) => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  href?: string;
}

const DashboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.75 7.29167V5.625C8.75 4.25522 8.75 3.57032 8.37167 3.10934C8.30242 3.02496 8.22504 2.94757 8.14066 2.87832C7.67968 2.5 6.99478 2.5 5.625 2.5C4.25522 2.5 3.57032 2.5 3.10934 2.87832C3.02496 2.94757 2.94757 3.02496 2.87832 3.10934C2.5 3.57032 2.5 4.25522 2.5 5.625V7.29167C2.5 8.66142 2.5 9.34633 2.87832 9.80733C2.94757 9.89175 3.02496 9.96908 3.10934 10.0383C3.57032 10.4167 4.25522 10.4167 5.625 10.4167C6.99478 10.4167 7.67968 10.4167 8.14066 10.0383C8.22504 9.96908 8.30242 9.89175 8.37167 9.80733C8.75 9.34633 8.75 8.66142 8.75 7.29167Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M6.45833 12.9167H4.79167C4.21018 12.9167 3.91944 12.9167 3.68286 12.9885C3.15019 13.1501 2.73335 13.5669 2.57177 14.0996C2.5 14.3362 2.5 14.6269 2.5 15.2084C2.5 15.7899 2.5 16.0807 2.57177 16.3172C2.73335 16.8499 3.15019 17.2667 3.68286 17.4283C3.91944 17.5001 4.21018 17.5001 4.79167 17.5001H6.45833C7.03982 17.5001 7.33056 17.5001 7.56714 17.4283C8.09981 17.2667 8.51667 16.8499 8.67825 16.3172C8.75 16.0807 8.75 15.7899 8.75 15.2084C8.75 14.6269 8.75 14.3362 8.67825 14.0996C8.51667 13.5669 8.09981 13.1501 7.56714 12.9885C7.33056 12.9167 7.03982 12.9167 6.45833 12.9167Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 14.3749V12.7083C17.5 11.3385 17.5 10.6536 17.1217 10.1926C17.0524 10.1082 16.9751 10.0308 16.8907 9.96159C16.4297 9.58325 15.7447 9.58325 14.375 9.58325C13.0052 9.58325 12.3203 9.58325 11.8593 9.96159C11.7749 10.0308 11.6976 10.1082 11.6283 10.1926C11.25 10.6536 11.25 11.3385 11.25 12.7083V14.3749C11.25 15.7447 11.25 16.4296 11.6283 16.8906C11.6976 16.975 11.7749 17.0523 11.8593 17.1216C12.3203 17.4999 13.0052 17.4999 14.375 17.4999C15.7447 17.4999 16.4297 17.4999 16.8907 17.1216C16.9751 17.0523 17.0524 16.975 17.1217 16.8906C17.5 16.4296 17.5 15.7447 17.5 14.3749Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M15.2083 2.5H13.5417C12.9602 2.5 12.6694 2.5 12.4328 2.57177C11.9002 2.73335 11.4833 3.15019 11.3217 3.68286C11.25 3.91944 11.25 4.21018 11.25 4.79167C11.25 5.37315 11.25 5.66389 11.3217 5.90048C11.4833 6.43314 11.9002 6.84998 12.4328 7.01157C12.6694 7.08333 12.9602 7.08333 13.5417 7.08333H15.2083C15.7898 7.08333 16.0806 7.08333 16.3172 7.01157C16.8498 6.84998 17.2667 6.43314 17.4283 5.90048C17.5 5.66389 17.5 5.37315 17.5 4.79167C17.5 4.21018 17.5 3.91944 17.4283 3.68286C17.2667 3.15019 16.8498 2.73335 16.3172 2.57177C16.0806 2.5 15.7898 2.5 15.2083 2.5Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  </svg>
);

const TelescopeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.8333 18.3333L11.6667 10.8333L7.5 18.3333"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.2663 3.33325L5.85596 7.71317C5.03743 8.19696 4.75698 9.26842 5.22957 10.1064L6.08523 11.6237C6.55781 12.4616 7.60446 12.7487 8.423 12.2649L15.8333 7.88499"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M13.5163 3.71318C13.1398 3.06073 13.3632 2.22643 14.0154 1.84974C14.6675 1.47304 15.5014 1.69659 15.8779 2.34905L18.1504 6.28698C18.5269 6.93944 18.3035 7.77373 17.6514 8.15043C16.9992 8.52716 16.1653 8.30357 15.7888 7.65111L13.5163 3.71318Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66663 11.8871L2.28177 13.0268M2.28177 13.0268L2.89691 14.1667M2.28177 13.0268L5.41663 11.25"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WorkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.66663 11.6666C1.66663 9.32584 1.66663 8.15543 2.22839 7.31469C2.47159 6.95072 2.78409 6.63822 3.14806 6.39502C3.9888 5.83325 5.15919 5.83325 7.49996 5.83325H12.5C14.8407 5.83325 16.0111 5.83325 16.8519 6.39502C17.2158 6.63822 17.5283 6.95072 17.7715 7.31469C18.3333 8.15543 18.3333 9.32584 18.3333 11.6666C18.3333 14.0073 18.3333 15.1778 17.7715 16.0185C17.5283 16.3824 17.2158 16.6949 16.8519 16.9382C16.0111 17.4999 14.8407 17.4999 12.5 17.4999H7.49996C5.15919 17.4999 3.9888 17.4999 3.14806 16.9382C2.78409 16.6949 2.47159 16.3824 2.22839 16.0185C1.66663 15.1778 1.66663 14.0073 1.66663 11.6666Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3333 5.83333C13.3333 4.26198 13.3333 3.47631 12.8451 2.98816C12.357 2.5 11.5713 2.5 9.99996 2.5C8.42863 2.5 7.64293 2.5 7.15478 2.98816C6.66663 3.47631 6.66663 4.26198 6.66663 5.83333"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 9.16675L5.54331 9.33508C8.40425 10.2217 11.5957 10.2217 14.4567 9.33508L15 9.16675M10 10.0001V11.6667"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StudentCardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6666 2.91675C14.8093 2.91675 16.3807 2.91675 17.357 3.95408C18.3333 4.99141 18.3333 6.66096 18.3333 10.0001C18.3333 13.3392 18.3333 15.0087 17.357 16.0461C16.3807 17.0834 14.8093 17.0834 11.6666 17.0834H8.33329C5.19059 17.0834 3.61925 17.0834 2.64293 16.0461C1.66663 15.0087 1.66663 13.3392 1.66663 10.0001C1.66663 6.66096 1.66663 4.99141 2.64293 3.95408C3.61925 2.91675 5.19059 2.91675 8.33329 2.91675H11.6666Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M4.16663 12.9165C5.50717 11.1353 8.62821 11.0382 9.99996 12.9165M8.54079 8.54157C8.54079 9.34699 7.88789 9.9999 7.08248 9.9999C6.27707 9.9999 5.62414 9.34699 5.62414 8.54157C5.62414 7.73617 6.27707 7.08325 7.08248 7.08325C7.88789 7.08325 8.54079 7.73617 8.54079 8.54157Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M12.5 7.91675H15.8333"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M12.5 11.25H14.1667"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);

const MortarboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.66663 6.66667C1.66663 7.78482 8.41238 10.8333 9.98838 10.8333C11.5643 10.8333 18.3101 7.78482 18.3101 6.66667C18.3101 5.54852 11.5643 2.5 9.98838 2.5C8.41238 2.5 1.66663 5.54852 1.66663 6.66667Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.99512 9.16675L5.19938 13.8583C5.20346 13.9522 5.21362 14.0463 5.24084 14.1363C5.32498 14.4145 5.48007 14.6672 5.71667 14.8371C7.56788 16.1655 12.4084 16.1655 14.2596 14.8371C14.4963 14.6672 14.6513 14.4145 14.7355 14.1363C14.7627 14.0463 14.7728 13.9522 14.777 13.8583L14.9812 9.16675"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.0611 7.91675V13.7501M17.0611 13.7501C16.4011 14.9553 16.1093 15.6011 15.8129 16.6667C15.7485 17.0459 15.7996 17.237 16.0609 17.4067C16.1671 17.4756 16.2947 17.5001 16.4212 17.5001H17.6882C17.8229 17.5001 17.9588 17.472 18.0698 17.3955C18.3127 17.228 18.3752 17.0442 18.3093 16.6667C18.0495 15.6772 17.7185 15.0007 17.0611 13.7501Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SupportIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.1666 11.5037C14.1666 11.2157 14.1666 11.0717 14.21 10.9433C14.336 10.5703 14.6681 10.4257 15.0009 10.2741C15.375 10.1037 15.562 10.0185 15.7473 10.0035C15.9577 9.98649 16.1685 10.0318 16.3483 10.1327C16.5867 10.2665 16.753 10.5207 16.9232 10.7275C17.7093 11.6823 18.1024 12.1598 18.2462 12.6863C18.3623 13.1112 18.3623 13.5555 18.2462 13.9803C18.0365 14.7482 17.3737 15.392 16.8831 15.9878C16.6322 16.2926 16.5067 16.445 16.3483 16.5339C16.1685 16.6348 15.9577 16.6802 15.7473 16.6632C15.562 16.6482 15.375 16.563 15.0009 16.3926C14.6681 16.241 14.336 16.0963 14.21 15.7233C14.1666 15.595 14.1666 15.451 14.1666 15.1629V11.5037Z"
      stroke="#525866"
      strokeWidth="1.25"
    />
    <path
      d="M7.91663 17.5C9.06721 18.6111 10.9327 18.6111 12.0833 17.5"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83329 11.5037C5.83329 11.1411 5.82311 10.8151 5.52988 10.5601C5.42323 10.4674 5.28183 10.403 4.99905 10.2741C4.62497 10.1038 4.43793 10.0186 4.25259 10.0036C3.69655 9.95864 3.39739 10.3381 3.07673 10.7276C2.29058 11.6824 1.89751 12.1598 1.75368 12.6863C1.63761 13.1111 1.63761 13.5555 1.75368 13.9803C1.96346 14.7482 2.62623 15.3918 3.1168 15.9876C3.42603 16.3632 3.72143 16.706 4.25259 16.663C4.43793 16.648 4.62497 16.5628 4.99905 16.3924C5.28183 16.2636 5.42323 16.1992 5.52988 16.1065C5.82311 15.8515 5.83329 15.5256 5.83329 15.1628V11.5037Z"
      stroke="#525866"
      strokeWidth="1.25"
    />
    <path
      d="M1.66663 13.3334V10.0001C1.66663 5.39771 5.39758 1.66675 9.99996 1.66675C14.6023 1.66675 18.3333 5.39771 18.3333 10.0001L18.3334 13.3334"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.7646 5.95108L17.3533 5.23725C17.0422 4.69739 16.8867 4.42746 16.622 4.31982C16.3574 4.21219 16.058 4.29712 15.4595 4.46699L14.4426 4.7534C14.0605 4.84154 13.6595 4.79154 13.3105 4.61225L13.0298 4.45027C12.7305 4.25861 12.5004 3.97603 12.373 3.64387L12.0947 2.81272C11.9117 2.2627 11.8202 1.9877 11.6024 1.8304C11.3846 1.6731 11.0953 1.6731 10.5166 1.6731H9.58762C9.00904 1.6731 8.71971 1.6731 8.50187 1.8304C8.28408 1.9877 8.19259 2.2627 8.00961 2.81272L7.73131 3.64387C7.60391 3.97603 7.37375 4.25861 7.07451 4.45027L6.79378 4.61225C6.44482 4.79154 6.04386 4.84154 5.66169 4.7534L4.64483 4.46699C4.04621 4.29712 3.74691 4.21219 3.48226 4.31982C3.21761 4.42746 3.06208 4.69739 2.751 5.23725L2.33968 5.95108C2.04809 6.45712 1.90229 6.71015 1.93059 6.9795C1.95888 7.24885 2.15406 7.4659 2.54442 7.90002L3.40362 8.86059C3.61362 9.12642 3.76271 9.58975 3.76271 10.0063C3.76271 10.4231 3.61367 10.8863 3.40365 11.1522L2.54442 12.1128C2.15406 12.5469 1.95889 12.7639 1.93059 13.0333C1.90229 13.3027 2.04809 13.5557 2.33968 14.0617L2.75099 14.7755C3.06206 15.3153 3.21761 15.5853 3.48226 15.6929C3.74691 15.8006 4.04622 15.7157 4.64485 15.5458L5.66166 15.2593C6.0439 15.1712 6.44493 15.2213 6.79393 15.4006L7.07462 15.5626C7.3738 15.7543 7.60391 16.0368 7.73129 16.3689L8.00961 17.2002C8.19259 17.7502 8.28408 18.0252 8.50187 18.1825C8.71971 18.3398 9.00904 18.3398 9.58762 18.3398H10.5166C11.0953 18.3398 11.3846 18.3398 11.6024 18.1825C11.8202 18.0252 11.9117 17.7502 12.0947 17.2002L12.373 16.3689C12.5004 16.0368 12.7305 15.7543 13.0297 15.5626L13.3104 15.4006C13.6594 15.2213 14.0604 15.1712 14.4426 15.2593L15.4595 15.5458C16.058 15.7157 16.3574 15.8006 16.622 15.6929C16.8867 15.5853 17.0422 15.3153 17.3533 14.7755L17.7646 14.0617C18.0562 13.5557 18.202 13.3027 18.1737 13.0333C18.1454 12.7639 17.9502 12.5469 17.5599 12.1128L16.7006 11.1522C16.4906 10.8863 16.3415 10.4231 16.3415 10.0063C16.3415 9.58975 16.4907 9.12642 16.7006 8.86059L17.5599 7.90002C17.9502 7.4659 18.1454 7.24885 18.1737 6.9795C18.202 6.71015 18.0562 6.45712 17.7646 5.95108Z"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M12.9329 9.99992C12.9329 11.6108 11.6271 12.9166 10.0163 12.9166C8.40542 12.9166 7.09961 11.6108 7.09961 9.99992C7.09961 8.38909 8.40542 7.08325 10.0163 7.08325C11.6271 7.08325 12.9329 8.38909 12.9329 9.99992Z"
      stroke="#525866"
      strokeWidth="1.25"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.8333 11.5037C15.8333 11.2157 15.8333 11.0717 15.79 10.9433C15.664 10.5703 15.3319 10.4257 14.9991 10.2741C14.625 10.1037 14.438 10.0185 14.2527 10.0035C14.0423 9.98649 13.8315 10.0318 13.6517 10.1327C13.4133 10.2665 13.247 10.5207 13.0768 10.7275C12.2907 11.6823 11.8976 12.1598 11.7538 12.6863C11.6377 13.1112 11.6377 13.5555 11.7538 13.9803C11.9635 14.7482 12.6263 15.392 13.1169 15.9878C13.3678 16.2926 13.4933 16.445 13.6517 16.5339C13.8315 16.6348 14.0423 16.6802 14.2527 16.6632C14.438 16.6482 14.625 16.563 14.9991 16.3926C15.3319 16.241 15.664 16.0963 15.79 15.7233C15.8333 15.595 15.8333 15.451 15.8333 15.1629V11.5037Z"
      stroke="#525866"
      strokeWidth="1.25"
    />
    <path
      d="M8.08337 17.5C6.93279 18.6111 5.06728 18.6111 3.91669 17.5"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.1667 11.5037C10.1667 11.1411 10.1769 10.8151 10.4701 10.5601C10.5768 10.4674 10.7182 10.403 11.001 10.2741C11.375 10.1038 11.5621 10.0186 11.7474 10.0036C12.3035 9.95864 12.6026 10.3381 12.9233 10.7276C13.7094 11.6824 14.1025 12.1598 14.2463 12.6863C14.3624 13.1111 14.3624 13.5555 14.2463 13.9803C14.0365 14.7482 13.3738 15.3918 12.8832 15.9876C12.574 16.3632 12.2786 16.706 11.7474 16.663C11.5621 16.648 11.375 16.5628 11.001 16.3924C10.7182 16.2636 10.5768 16.1992 10.4701 16.1065C10.1769 15.8515 10.1667 15.5256 10.1667 15.1628V11.5037Z"
      stroke="#525866"
      strokeWidth="1.25"
    />
    <path
      d="M18.3333 13.3334V10.0001C18.3333 5.39771 14.6024 1.66675 10 1.66675C5.39771 1.66675 1.66667 5.39771 1.66667 10.0001L1.66667 13.3334"
      stroke="#525866"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    href: "/dashboard",
  },
  {
    id: "discover-talent",
    label: "Discover Talent",
    icon: <TelescopeIcon />,
    href: "/discover-talent",
  },
  {
    id: "create-opportunities",
    label: "Create Opportuities",
    icon: <WorkIcon />,
    href: "/opportunities",
  },
  {
    id: "applicants",
    label: "Applicants",
    icon: <WorkIcon />,
    href: "/applicants",
  },
  {
    id: "notification",
    label: "Notifications",
    icon: <BellIcon />,
    badge: 5,
  },
  {
    id: "mentorship",
    label: "Mentorship",
    icon: <StudentCardIcon />,
    href: "/mentorship",
  },
  {
    id: "learning",
    label: "Learning",
    icon: <MortarboardIcon />,
    href: "/learning",
  },
];

const otherItems: Omit<MenuItem, "badge">[] = [
  { id: "support", label: "Support", icon: <SupportIcon /> },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
    href: "/settings",
  },
];

const getMenuItems = (notificationCount?: number): MenuItem[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    href: "/dashboard",
  },
  {
    id: "discover-talent",
    label: "Discover Talent",
    icon: <TelescopeIcon />,
    href: "/discover-talent",
  },
  {
    id: "create-opportunities",
    label: "Create Opportuities",
    icon: <WorkIcon />,
    href: "/opportunities",
  },
  {
    id: "applicants",
    label: "Applicants",
    icon: <WorkIcon />,
    href: "/applicants",
  },
  {
    id: "notification",
    label: "Notifications",
    icon: <BellIcon />,
    badge: notificationCount,
  },
  {
    id: "mentorship",
    label: "Mentorship",
    icon: <StudentCardIcon />,
    href: "/mentorship",
  },
  {
    id: "learning",
    label: "Learning",
    icon: <MortarboardIcon />,
    href: "/learning",
  },
];

export function RecruiterSidebar({
  activeItem = "dashboard",
  onItemSelect,
  onNotificationClick,
  notificationCount = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const { currentProfile, currentProfileUI } = useProfile();
  const menuItems = getMenuItems(notificationCount);

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNotificationClick?.();
  };

  const profile = useMemo(() => {
    return currentProfileUI || currentProfile;
  }, [currentProfileUI, currentProfile]);

  return (
    <aside className="hidden md:flex w-[250px] flex-col bg-white border-r border-[#E1E4EA] h-screen overflow-hidden">
      {/* Logo Section */}
      <div className="px-[30px] py-[12px] flex-shrink-0">
        <div className="flex items-center gap-[10px]">
          <img
            src="/logo.png"
            alt="TalentNG Logo"
            className="w-[40px] h-[30px] rounded-[2.679px] object-cover"
          />
          <span className="font-medium text-[16px] text-black font-inter-tight">
            TalentNG
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 px-[20px] py-[8px] overflow-y-auto">
        <div className="flex flex-col gap-[6px]">
          {/* Profile Switcher */}
          <ProfileSwitcher />

          {/* Main Navigation */}
          <div className="flex flex-col gap-[6px]">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const isNotification = item.id === "notification";
              const MenuComponent = isNotification ? "button" : "a";

              return (
                <MenuComponent
                  key={item.id}
                  href={isNotification ? undefined : item.href}
                  onClick={(e: any) => {
                    if (isNotification) {
                      handleNotificationClick(e);
                    } else {
                      onItemSelect?.(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-[8px] px-[12px] py-[6px] rounded-lg transition-colors relative flex-shrink-0",
                    isActive
                      ? "bg-white text-[#525866]"
                      : "text-[#525866] hover:bg-white/50",
                  )}
                >
                  {item.icon}
                  <span className="text-[13px] font-normal font-inter-tight text-left flex-1">
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E63C23] flex-shrink-0">
                      <span className="text-[11px] font-semibold text-white font-inter-tight">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </MenuComponent>
              );
            })}
          </div>
        </div>
      </div>

      {/* Others Section */}
      <div className=" px-[20px] py-[8px] flex-shrink-0">
        <div className="px-[12px] mb-[8px]">
          <span className="text-[11px] font-medium text-[rgba(0,0,0,0.30)] font-inter-tight">
            OTHERS
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          {otherItems.map((item) => {
            const isActive = pathname === item.href;
            const MenuComponent = item.href ? Link : "button";
            return (
              <MenuComponent
                key={item.id}
                href={item.href || "#"}
                onClick={() => onItemSelect?.(item.id)}
                className={cn(
                  "w-full flex items-center gap-[8px] px-[12px] py-[6px] rounded-lg transition-colors relative flex-shrink-0",
                  isActive
                    ? "bg-white text-[#525866]"
                    : "text-[#525866] hover:bg-white/50",
                )}
              >
                {item.icon}
                <span className="text-[13px] font-normal font-inter-tight text-left flex-1">
                  {item.label}
                </span>
              </MenuComponent>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
