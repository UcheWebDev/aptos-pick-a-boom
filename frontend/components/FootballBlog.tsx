import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderPinwheel, Clock, ExternalLink, ChevronRight, Trophy, Image as ImageIcon } from "lucide-react";
import NoArticles from "./NoArticles";

const NewsCardSkeleton = () => (
  <div className="bg-gray-800 w-72 p-6 border rounded-lg border-gray-700 animate-pulse">
    <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-700 rounded-lg w-12 h-12"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="mt-4 h-4 bg-gray-700 rounded w-full"></div>
    <div className="mt-2 h-4 bg-gray-700 rounded w-3/4"></div>
  </div>
);

const ImageWithFallback = ({ src, alt }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className="relative h-48 bg-gray-800 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <LoaderPinwheel className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <ImageIcon className="w-8 h-8 text-gray-600" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
};

const NewsCard = ({ article }) => {
  return (
    <div className="relative group">
      <div className="relative bg-gray-900 p-6 border border-gray-700 rounded-lg backdrop-blur-xl w-72">
        {article.image_url && (
          <div className="mb-4">
            <ImageWithFallback src={article.image_url} alt={article.title} />
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 ">
            <h3 className="font-bold text-white line-clamp-2">{article.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-3">{article.description}</p>
            <div className="flex justify-between items-center text-sm pt-2">
              <div className="flex items-center text-amber-400">
                <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>{new Date(article.published_at).toLocaleDateString()}</span>
              </div>
              <div className="max-w-[120px]">
                <span className="text-green-400 block truncate" title={article.source_name}>
                  {article.source_name}
                </span>
              </div>
            </div>
          </div>

          <a href={article.url} target="_blank" rel="noopener noreferrer" className="relative w-full block mt-6 group">
            <div className="relative bg-gray-900 text-white py-3 font-medium group-hover:bg-gray-900/50 transition-all flex items-center justify-center gap-2 border border-gray-500/20">
              <span className="group-hover:text-amber-400 transition-colors">Read More</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

const NewsSection = ({ title, articles, isLoading }) => {
  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={`skeleton-${index}`} className="flex-none">
                <NewsCardSkeleton />
              </div>
            ))
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="flex-none">
              <NewsCard article={article} />
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-500 py-8">
            <NoArticles />
          </div>
        )}
      </div>
    </div>
  );
};

const FootballBlog = ({ latestNews, transferNews, isLoading, error }) => {
  if (error) {
    return <div className="text-red-500 text-center py-8">Error loading news: {error}</div>;
  }

  return (
    <div className="space-y-8 mt-10">
      <NewsSection title="Latest Football News" articles={latestNews} isLoading={isLoading} />
      <NewsSection title="Transfer News & Rumors" articles={transferNews} isLoading={isLoading} />
    </div>
  );
};

export default FootballBlog;
