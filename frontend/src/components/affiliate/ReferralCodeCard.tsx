import { useState } from 'react';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Icon } from '@/components/icon';
import { toast } from 'sonner';

interface ReferralCodeCardProps {
  referralCode: string;
  shareableLink: string;
}

export function ReferralCodeCard({ referralCode, shareableLink }: ReferralCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopiedLink(true);
      toast.success('Link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const encodedLink = encodeURIComponent(shareableLink);
    const text = encodeURIComponent('Join me and start earning with our affiliate program!');

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedLink}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
          <Icon icon="solar:link-bold-duotone" className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Referral Code</h3>
          <p className="text-sm text-gray-600">Share this code to earn commissions</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Referral Code</label>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
            <code className="text-lg font-bold tracking-wide text-primary-600">
              {referralCode}
            </code>
          </div>
          <Button onClick={handleCopyCode} variant="outline" size="icon" className="h-12 w-12">
            <Icon
              icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'}
              className={`h-5 w-5 ${copied ? 'text-green-600' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* Shareable Link */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Shareable Link</label>
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
            <p className="truncate text-sm text-gray-700">{shareableLink}</p>
          </div>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="icon"
            className="h-12 w-12"
          >
            <Icon
              icon={copiedLink ? 'solar:check-circle-bold' : 'solar:copy-bold'}
              className={`h-5 w-5 ${copiedLink ? 'text-green-600' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* Social Share */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Share on</label>
        <div className="flex gap-2">
          <Button
            onClick={() => handleShare('facebook')}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Icon icon="mdi:facebook" className="mr-2 h-4 w-4 text-blue-600" />
            Facebook
          </Button>
          <Button
            onClick={() => handleShare('twitter')}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Icon icon="mdi:twitter" className="mr-2 h-4 w-4 text-sky-500" />
            Twitter
          </Button>
          <Button
            onClick={() => handleShare('linkedin')}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Icon icon="mdi:linkedin" className="mr-2 h-4 w-4 text-blue-700" />
            LinkedIn
          </Button>
        </div>
      </div>
    </Card>
  );
}
