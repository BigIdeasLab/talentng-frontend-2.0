"use client";

import Image from "next/image";
import { Briefcase } from "lucide-react";

interface ServiceTag {
  label: string;
}

interface Service {
  id: string;
  image: string;
  tags: ServiceTag[];
  title: string;
  price: string;
}

interface ServicesGridProps {
  services?: Service[];
  isLoading?: boolean;
  onServiceClick?: (service: Service) => void;
}

const defaultServices: Service[] = [
  {
    id: "1",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/006e1249db9b7d609ae3b3246ecaa7c825dfa329?width=518",
    tags: [{ label: "Branding" }, { label: "Logo Design" }],
    title: "Brand Identity Design",
    price: "Starting from $200",
  },
  {
    id: "2",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/743d9e734f8602de97475d6fc1c1d00c06de778e?width=518",
    tags: [{ label: "Prototyping" }, { label: "Wireframing" }],
    title: "Mobile App Ui/Ux",
    price: "Starting from $200",
  },
  {
    id: "3",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/f8c98e0981eccf4ffb9da93b3d7a21a125ae4e92?width=518",
    tags: [
      { label: "Responsive Design" },
      { label: "Webflow" },
      { label: "+3" },
    ],
    title: "Website Design",
    price: "Starting from $200",
  },
  {
    id: "4",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/34d7fe36e40215add8f70c600abebfb4cc8e9bd6?width=518",
    tags: [{ label: "Character Design" }, { label: "Vector Art" }],
    title: "Illustration",
    price: "Starting from $200",
  },
  {
    id: "5",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/69789ac41455ce764a1265e4ab77e0c74efd3b84?width=518",
    tags: [{ label: "Branding" }, { label: "Logo Design" }],
    title: "Icon Animation",
    price: "Starting from $200",
  },
];

export function ServicesGrid({
  services = defaultServices,
  isLoading = false,
  onServiceClick,
}: ServicesGridProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading services...</div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">No services yet</p>
          <p className="text-sm">Start by adding your first service</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[11px] gap-y-[25px]">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceClick?.(service)}
            className="group flex flex-col items-start gap-[10px] text-left hover:opacity-80 transition-opacity"
          >
            {/* Service Image */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Service Details */}
            <div className="flex flex-col items-start gap-[15px] w-full">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-[5px]">
                {service.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex px-[13px] py-[12px] justify-center items-center rounded-[30px] bg-[#F5F5F5]"
                  >
                    <span className="text-[13px] font-normal leading-[105%] font-inter-tight text-black">
                      {tag.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-[18px] font-medium leading-normal font-inter-tight text-black">
                {service.title}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-[5px]">
                <Briefcase
                  className="w-[18px] h-[18px]"
                  strokeWidth={1.2}
                  color="rgba(0, 0, 0, 0.3)"
                />
                <span className="text-[15px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)]">
                  {service.price}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
