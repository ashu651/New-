'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FeedCard({ caption, author }: { caption: string; author: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border rounded-xl p-4 space-y-2 bg-white dark:bg-black/30"
      aria-label={`Post by ${author}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 skeleton" aria-hidden />
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted">@{author.toLowerCase().replace(/\s/g,'')}</div>
        </div>
      </div>
      <div className={!loaded ? 'skeleton h-48 rounded-lg' : 'h-48 rounded-lg bg-gray-100 dark:bg-gray-800'} onAnimationEnd={()=>setLoaded(true)} />
      <p>{caption}</p>
      <div className="flex gap-3 text-sm text-muted" role="group" aria-label="Actions">
        <button className="hover:underline" aria-label="Like">Like</button>
        <button className="hover:underline" aria-label="Comment">Comment</button>
        <button className="hover:underline" aria-label="Save">Save</button>
      </div>
    </motion.article>
  );
}