import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SavedCardsSkeleton = () => {
  return (
    <div className="text-white py-6">
      {/* Header */}
      <div className="mb-7 flex items-center gap-2">
        <Skeleton width={24} height={24} />
        <Skeleton width={200} height={20} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Credit/Debit Card Section */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 row-span-2">
          <div className="flex justify-between items-center mb-3">
            <Skeleton width={120} height={18} />
            <Skeleton width={100} height={18} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Card Skeleton 1 */}
            <div className="w-full">
              <div className="rounded-2xl mb-3 overflow-hidden border border-white/30">
                <div className="p-4 pb-0">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton width={40} height={30} />
                    <Skeleton width={28} height={28} />
                  </div>
                  <Skeleton width={200} height={24} className="mb-8" />
                </div>
                <div className="p-4 border-t border-white/20">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <Skeleton width={80} height={12} className="mb-1" />
                      <Skeleton width={100} height={14} />
                    </div>
                    <div>
                      <Skeleton width={60} height={12} className="mb-1" />
                      <Skeleton width={40} height={14} />
                    </div>
                    <Skeleton width={40} height={18} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton width={16} height={16} />
                  <Skeleton width={80} height={14} />
                </div>
                <div className="flex gap-3">
                  <Skeleton width={20} height={20} />
                  <Skeleton width={20} height={20} />
                </div>
              </div>
            </div>

            {/* Card Skeleton 2 */}
            <div className="w-full">
              <div className="rounded-2xl mb-3 overflow-hidden border border-white/30">
                <div className="p-4 pb-0">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton width={40} height={30} />
                    <Skeleton width={28} height={28} />
                  </div>
                  <Skeleton width={200} height={24} className="mb-8" />
                </div>
                <div className="p-4 border-t border-white/20">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <Skeleton width={80} height={12} className="mb-1" />
                      <Skeleton width={100} height={14} />
                    </div>
                    <div>
                      <Skeleton width={60} height={12} className="mb-1" />
                      <Skeleton width={40} height={14} />
                    </div>
                    <Skeleton width={40} height={18} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton width={16} height={16} />
                  <Skeleton width={80} height={14} />
                </div>
                <div className="flex gap-3">
                  <Skeleton width={20} height={20} />
                  <Skeleton width={20} height={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 lg:col-start-4 pl-0 lg:pl-10">
          <div className="flex justify-between items-center mb-3">
            <Skeleton width={100} height={18} />
            <Skeleton width={120} height={18} />
          </div>

          {/* Bank Account Skeleton 1 */}
          <div className="p-4 flex items-start justify-between bg-white/10 rounded-xl mt-5">
            <div className="flex items-center gap-2">
              <Skeleton width={56} height={56} />
              <div className="flex flex-col">
                <Skeleton width={120} height={16} className="mb-2" />
                <Skeleton width={100} height={14} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton width={20} height={20} />
              <Skeleton width={20} height={20} />
              <Skeleton width={20} height={20} />
            </div>
          </div>

          {/* Bank Account Skeleton 2 */}
          <div className="p-4 flex items-start justify-between bg-white/10 rounded-xl mt-5">
            <div className="flex items-center gap-2">
              <Skeleton width={56} height={56} />
              <div className="flex flex-col">
                <Skeleton width={150} height={16} className="mb-2" />
                <Skeleton width={120} height={14} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton width={20} height={20} />
              <Skeleton width={20} height={20} />
              <Skeleton width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCardsSkeleton;
