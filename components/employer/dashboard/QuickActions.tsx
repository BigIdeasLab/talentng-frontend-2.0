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
      className="flex h-10 px-4.5 flex-col justify-center items-start gap-2.5 rounded-[10px] border border-[#E1E4EA] bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-inter-tight text-[15px] font-normal text-[#525866]">
          {label}
        </span>
      </div>
    </button>
  );
}

export function QuickActions() {
  return (
    <div className="flex flex-col md:flex-row w-full px-6.5 py-6 md:py-8 justify-between items-start md:items-center gap-4 rounded-xl bg-[#FBF9FA]">
      <div className="flex flex-col items-start gap-2 md:gap-1 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#5C30FF]" strokeWidth={2} />
          <h2 className="font-inter-tight text-lg font-semibold text-black">
            Quick Actions
          </h2>
        </div>
        <p className="font-inter-tight text-[13px] font-normal text-[#525866] self-stretch">
          Jump into common tasks to keep your hiring pipelines moving
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
        <ActionButton
          icon={<Users className="w-4 h-4 text-[#525866]" strokeWidth={1.24} />}
          label="View Applicants"
          onClick={() => {
            /* Handle navigation */
          }}
        />
        <ActionButton
          icon={
            <Briefcase className="w-4 h-4 text-[#525866]" strokeWidth={1.6} />
          }
          label="Post Opportunity"
          onClick={() => {
            /* Handle navigation */
          }}
        />
        <ActionButton
          icon={
            <CheckCircle className="w-4 h-4 text-[#606060]" strokeWidth={1.6} />
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
