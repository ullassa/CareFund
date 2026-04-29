import { Injectable } from '@angular/core';

export interface ShareOptions {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SocialShareService {
  private baseUrl = window.location.origin;

  constructor() {}

  /**
   * Share via Web Share API (native)
   */
  async shareNative(options: ShareOptions): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  }

  /**
   * Share on Facebook
   */
  shareFacebook(url: string, quote?: string): void {
    const fbUrl = new URL('https://www.facebook.com/sharer/sharer.php');
    fbUrl.searchParams.set('u', url);
    if (quote) fbUrl.searchParams.set('quote', quote);
    window.open(fbUrl.toString(), 'facebook-share', 'width=800,height=600');
  }

  /**
   * Share on Twitter
   */
  shareTwitter(text: string, url: string, hashtags?: string[]): void {
    const twitterUrl = new URL('https://twitter.com/intent/tweet');
    twitterUrl.searchParams.set('text', text);
    twitterUrl.searchParams.set('url', url);
    if (hashtags?.length) {
      twitterUrl.searchParams.set('hashtags', hashtags.join(','));
    }
    window.open(twitterUrl.toString(), 'twitter-share', 'width=800,height=600');
  }

  /**
   * Share on LinkedIn
   */
  shareLinkedIn(url: string, title?: string, summary?: string): void {
    const linkedinUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
    linkedinUrl.searchParams.set('url', url);
    window.open(linkedinUrl.toString(), 'linkedin-share', 'width=800,height=600');
  }

  /**
   * Share on WhatsApp
   */
  shareWhatsApp(text: string, url: string): void {
    const whatsappUrl = new URL('https://wa.me/');
    whatsappUrl.search = `?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl.toString(), 'whatsapp-share');
  }

  /**
   * Share via Email
   */
  shareEmail(to: string, subject: string, body: string): void {
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  /**
   * Copy link to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }

  /**
   * Get share URL for donation
   */
  getDonationShareUrl(charityId: string): string {
    return `${this.baseUrl}/charity/${charityId}`;
  }

  /**
   * Generate short share message
   */
  generateShareMessage(charityName: string, cause: string): string {
    return `I just donated to ${charityName} to support ${cause}. Join me in making a difference with CareFund!`;
  }

  /**
   * Check if native share is supported
   */
  isNativeShareSupported(): boolean {
    return !!(navigator && navigator.share);
  }

  /**
   * Get share count (if integrated with analytics)
   */
  trackShare(platform: string, url: string): void {
    // Send event to analytics service
    const event = new CustomEvent('socialShare', {
      detail: {
        platform,
        url,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Generate fundraiser badge/ribbon
   */
  generateDonationBadge(amount: number, currency: string = '₹'): string {
    return `<span class="donation-badge">Donated ${currency}${amount.toLocaleString()}</span>`;
  }

  /**
   * Share donation achievement
   */
  async shareDonationAchievement(
    amount: number,
    charityName: string,
    platform: 'twitter' | 'facebook' | 'whatsapp' | 'native' = 'twitter'
  ): Promise<void> {
    const message = `I just donated ₹${amount.toLocaleString()} to ${charityName} through CareFund. Every rupee makes a difference! #Charity #Giving`;
    const url = this.getDonationShareUrl(charityName);

    switch (platform) {
      case 'twitter':
        this.shareTwitter(message, url, ['CareFund', 'Charity', 'Giving']);
        break;
      case 'facebook':
        this.shareFacebook(url, message);
        break;
      case 'whatsapp':
        this.shareWhatsApp(message, url);
        break;
      case 'native':
        if (this.isNativeShareSupported()) {
          await this.shareNative({
            title: 'Donation Achievement',
            text: message,
            url
          });
        }
        break;
    }

    this.trackShare(platform, url);
  }
}
