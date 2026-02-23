import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  storageKey: string;
  defaultExpanded?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  storageKey,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(() => {
    // 从 localStorage 读取状态
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`collapsible_${storageKey}`);
      if (saved !== null) {
        return saved === "true";
      }
    }
    return defaultExpanded;
  });

  const toggleExpanded = React.useCallback(() => {
    setIsExpanded((prev) => {
      const newValue = !prev;
      // 保存到 localStorage
      localStorage.setItem(`collapsible_${storageKey}`, String(newValue));
      return newValue;
    });
  }, [storageKey]);

  return (
    <div className="border-2 border-black bg-white overflow-hidden">
      {/* 标题栏 - 可点击 */}
      <button
        onClick={toggleExpanded}
        className="w-full p-4 md:p-6 border-b border-black/10 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={`collapsible-content-${storageKey}`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-black">{icon}</span>}
          <h3 className="text-lg font-black tracking-tighter">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown size={20} className="text-black" />
        </motion.div>
      </button>

      {/* 内容区域 - 可折叠 */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`collapsible-content-${storageKey}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2, ease: "easeInOut" },
            }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
