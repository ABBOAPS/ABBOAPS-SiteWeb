import { motion } from "motion/react";
import Markdown from "react-markdown";
import { SEO } from "../components/SEO";
import { privacyPolicyMarkdown } from "../data/privacyData";

export function PrivacyPolicy() {
  return (
    <main className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col pb-48 text-[#4a1c0d]">
      <SEO 
        title="Privacy Policy | ABBO APS" 
        description="Informativa sulla privacy e sul trattamento dei dati personali dell'associazione ABBO APS."
        url="/privacy-policy" 
      />
      
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col clay-card p-8 md:p-14 mb-12"
        >
          <div className="relative text-lg md:text-xl text-[#4a1c0d] font-normal tracking-wide leading-relaxed markdown-body">
            <Markdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl md:text-5xl mt-6 mb-8 font-extrabold text-[#e65100] tracking-tight text-center" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl mt-12 mb-5 font-bold text-[#4a1c0d]" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl mt-8 mb-4 font-bold text-[#4a1c0d]" {...props} />,
                p: ({node, ...props}) => <p className="mb-6 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-8 mb-6 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-8 mb-6 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="" {...props} />,
                a: ({node, ...props}) => <a className="text-[#e65100] font-bold underline hover:text-[#ff8f00] transition-colors" {...props} />,
                strong: ({node, ...props}) => <strong className="font-extrabold text-[#4a1c0d]" {...props} />,
              }}
            >
              {privacyPolicyMarkdown}
            </Markdown>
          </div>
        </motion.article>
      </div>
    </main>
  );
}
