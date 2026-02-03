import { Users, Briefcase, CheckCircle, UserCheck } from "lucide-react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 px-3.5 flex-col justify-center items-start gap-2 rounded-lg border border-[#E1E4EA] bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-1">
        {icon}
        <span className="font-inter-tight text-[12px] font-normal text-[#525866]">
          {label}
        </span>
      </div>
    </button>
  );
}

export function QuickActions() {
  return (
    <div className="flex flex-col md:flex-row w-full px-5 py-4 md:py-5 justify-between items-start md:items-center gap-3 rounded-lg bg-[#FBF9FA] flex-shrink-0">
      <div className="flex flex-col items-start gap-1.5 md:gap-0.5 w-full md:w-auto">
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-[#5C30FF]" strokeWidth={2} />
          <h2 className="font-inter-tight text-base font-semibold text-black">
            Quick Actions
          </h2>
        </div>
        <p className="font-inter-tight text-[11px] font-normal text-[#525866] self-stretch">
          Jump into common tasks to keep your hiring pipelines moving
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <ActionButton
          icon={
            <Users className="w-3.5 h-3.5 text-[#525866]" strokeWidth={1.24} />
          }
          label="View Applicants"
          onClick={() => {
            /* Handle navigation */
          }}
        />
        <ActionButton
          icon={
            <Briefcase
              className="w-3.5 h-3.5 text-[#525866]"
              strokeWidth={1.6}
            />
          }
          label="Post Opportunity"
          onClick={() => {
            /* Handle navigation */
          }}
        />
        <ActionButton
          icon={
            <CheckCircle
              className="w-3.5 h-3.5 text-[#606060]"
              strokeWidth={1.6}
            />
          }
          label="Hired Talents"
          onClick={() => {
            /* Handle navigation */
          }}
        />
      </div>
    </div>
  );
}
