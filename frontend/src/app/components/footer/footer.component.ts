import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type HelpRole = 'bot' | 'user';
type HelpIntent = {
  id: string;
  keywords: string[];
  reply: string;
  followUps?: string[];
};

type HelpMessage = {
  role: HelpRole;
  text: string;
  time: string;
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements AfterViewInit {
  @ViewChild('helpChatBody') helpChatBody?: ElementRef<HTMLDivElement>;
  currentYear = new Date().getFullYear();
  contactOpen = false;
  contactSubmitted = false;
  contactForm = { email: '', reason: '' };
  faqOpen = false;
  helpChatOpen = false;
  helpInput = '';
  helpMessages: HelpMessage[] = [
    {
      role: 'bot',
      text: 'Hi, I am the CareFund help assistant.\nTry asking about donation steps, receipt PDF, login reset, charity approval, dashboard reports, or profile rules.',
      time: this.formatHelpTime()
    }
  ];
  quickHelpSuggestions: string[] = [
    'How do I donate?',
    'How to download receipt PDF?',
    'Why is my charity status pending?',
    'What does account on hold mean?',
    'How to reset password?',
    'Can I donate anonymously?'
  ];
  helpSuggested: string[] = [...this.quickHelpSuggestions];
  helpIsTyping = false;

  private readonly helpIntents: HelpIntent[] = [
    {
      id: 'greeting',
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening'],
      reply: 'Hi! I can help with donation, payment, receipts, login, charity approval, dashboard, and profile updates.',
      followUps: ['Donation steps', 'Receipt PDF', 'Reset password']
    },
    {
      id: 'donate',
      keywords: ['donate', 'donation', 'donation steps', 'how to donate', 'pay', 'payment', 'donor', 'amount'],
      reply: 'To donate: open the Donate page, choose a charity, select the amount, and complete payment.\nAfter success, the receipt is available in Donor Dashboard and is also emailed to you.',
      followUps: ['Receipt PDF', 'Anonymous donation']
    },
    {
      id: 'anonymous',
      keywords: ['anonymous', 'anonymous donation', 'hide my identity', 'hide identity', 'private donation'],
      reply: 'Yes. Enable anonymous donation in the payment section.\nYour name will be hidden from charity-facing donation views while still keeping your receipt for your own records.',
      followUps: ['Donation steps']
    },
    {
      id: 'receipt',
      keywords: ['receipt', 'receipt pdf', 'pdf', 'download receipt', 'invoice', 'tax'],
      reply: 'Go to Donor Dashboard → Recent Donations → click the receipt icon.\nIf the PDF looks blank, refresh and download again; if it still fails, share the donation ID so it can be checked.',
      followUps: ['Donation steps', 'Contact support']
    },
    {
      id: 'login',
      keywords: ['login', 'login help', 'sign in', 'cannot login', 'forgot password', 'reset password', 'password reset', 'otp'],
      reply: 'Use the Login page to sign in.\nIf you forgot your password, open Forgot Password and complete OTP verification to reset securely.',
      followUps: ['Reset password', 'Open contact form']
    },
    {
      id: 'donor-signup',
      keywords: ['register', 'signup', 'sign up', 'donor signup', 'create account', 'donor account', 'customer account'],
      reply: 'Use Customer Signup to create a donor account.\nComplete email and phone OTP verification, then set a strong password to proceed.',
      followUps: ['Login help']
    },
    {
      id: 'charity-signup',
      keywords: ['charity signup', 'charity registration', 'register charity', 'charity apply', 'ngo signup'],
      reply: 'Use Charity Signup, fill in organization and manager details, upload images, and submit.\nStatus appears as Pending, Approved, Rejected, or Hold after admin review.',
      followUps: ['Charity status meaning', 'Contact support']
    },
    {
      id: 'charity-status',
      keywords: ['pending', 'approved', 'rejected', 'hold', 'under review', 'status', 'charity status meaning'],
      reply: 'Charity status flow: Pending means under review, Approved enables the dashboard, and Rejected or Hold blocks access with an admin comment.',
      followUps: ['Charity signup', 'Open contact form']
    },
    {
      id: 'dashboard',
      keywords: ['dashboard', 'dashboard help', 'chart', 'analytics', 'recent donation', 'trend', 'report'],
      reply: 'Dashboards show donation trends, totals, and recent records.\nThe charity dashboard also shows target progress and donor/payment details.',
      followUps: ['Donation steps', 'Receipt PDF']
    },
    {
      id: 'profile',
      keywords: ['profile', 'profile update rules', 'edit profile', 'update profile', 'name', 'address', 'city'],
      reply: 'Profile permissions: donors can edit name and address or city only.\nCharity profile is read-only on the profile page under the current rules.',
      followUps: ['Open FAQ']
    },
    {
      id: 'support',
      keywords: ['faq', 'help', 'support', 'contact', 'email', 'phone'],
      reply: 'Open FAQ from the footer for quick answers, or use Contact Us to submit your issue.\nFor registration support, email carefund03@gmail.com.',
      followUps: ['Open FAQ', 'Open contact form']
    },
    {
      id: 'thanks',
      keywords: ['thanks', 'thank you', 'ok', 'great'],
      reply: 'Happy to help. If you share the exact issue text, I can guide you step-by-step.',
      followUps: ['Donation steps', 'Reset password']
    }
  ];

  quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
  ];

  faqs = [
    {
      question: 'How do I donate to a charity?',
      answer: 'Go to Donate, select a charity, choose amount, and complete payment.'
    },
    {
      question: 'Can I donate anonymously?',
      answer: 'Yes. Use the anonymous toggle in payment options to hide your identity from charity view.'
    },
    {
      question: 'How do I download donation receipt PDF?',
      answer: 'Open Donor Dashboard and click Receipt PDF next to the donation.'
    },
    {
      question: 'How does charity approval work?',
      answer: 'Admin reviews submitted documents and profile details before approving.'
    }
  ];

  legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  socialLinks = [
    { label: 'Facebook', icon: 'FB', url: 'https://facebook.com' },
    { label: 'Twitter', icon: 'X', url: 'https://twitter.com' },
    { label: 'LinkedIn', icon: 'IN', url: 'https://linkedin.com' },
    { label: 'Instagram', icon: 'IG', url: 'https://instagram.com' },
  ];

  openContact(): void {
    this.contactSubmitted = false;
    this.contactOpen = true;
  }

  closeContact(): void {
    this.contactOpen = false;
  }

  openFaq(): void {
    this.faqOpen = true;
  }

  closeFaq(): void {
    this.faqOpen = false;
  }

  toggleHelpChat(): void {
    this.helpChatOpen = !this.helpChatOpen;
    if (this.helpChatOpen) {
      this.helpSuggested = [...this.quickHelpSuggestions];
      this.scrollHelpToBottom();
    }
  }

  ngAfterViewInit(): void {
    this.scrollHelpToBottom();
  }

  sendHelpMessage(): void {
    const input = this.helpInput.trim();
    if (!input) {
      return;
    }

    this.pushHelpExchange(input);
    this.helpInput = '';
  }

  sendQuickHelpMessage(message: string): void {
    const value = (message || '').trim();
    if (!value) {
      return;
    }

    if (this.handleHelpAction(value)) {
      return;
    }
    this.pushHelpExchange(value);
  }

  private pushHelpExchange(input: string): void {
    this.helpMessages.push({ role: 'user', text: input, time: this.formatHelpTime() });
    const response = this.getHelpReply(input);
    this.helpSuggested = response.suggestions.length ? response.suggestions : [...this.quickHelpSuggestions];
    this.helpIsTyping = true;
    this.scrollHelpToBottom();
    setTimeout(() => {
      this.helpMessages.push({ role: 'bot', text: response.text, time: this.formatHelpTime() });
      this.helpIsTyping = false;
      this.scrollHelpToBottom();
    }, 420);
  }

  private getHelpReply(input: string): { text: string; suggestions: string[] } {
    const normalized = this.normalizeText(input);
    if (!normalized) {
      return {
        text: 'Share a quick question and I will guide you step-by-step.',
        suggestions: [...this.quickHelpSuggestions]
      };
    }

    const intentMatches = this.helpIntents
      .map(intent => ({ intent, score: this.scoreIntentMatch(normalized, intent) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (intentMatches.length > 0 && intentMatches[0].score >= 2) {
      const best = intentMatches[0].intent;
      return {
        text: best.reply,
        suggestions: best.followUps ? [...best.followUps] : []
      };
    }

    const faqMatch = this.faqs.find(item => {
      const q = this.normalizeText(item.question);
      return this.sharedWordCount(normalized, q) >= 2;
    });

    if (faqMatch) {
      return {
        text: `${faqMatch.answer}\n\nIf you want, I can also explain the exact steps one by one.`,
        suggestions: ['Donation steps', 'Receipt PDF', 'Open FAQ']
      };
    }

    const fallbackSuggestions = intentMatches.slice(0, 2).map(item => this.intentToSuggestion(item.intent.id));
    const suggestions = fallbackSuggestions.filter(Boolean).slice(0, 2) as string[];
    return {
      text: 'I could not fully map that yet.\nTry one of these: donation steps, anonymous donation, receipt PDF, login or password reset, charity registration status, dashboard data, or profile update rules.',
      suggestions: suggestions.length ? suggestions : ['Donation steps', 'Receipt PDF', 'Open contact form']
    };
  }

  private scoreIntentMatch(normalized: string, intent: HelpIntent): number {
    const inputTokens = normalized.split(' ').filter(Boolean);
    let score = 0;

    intent.keywords.forEach(keyword => {
      const normalizedKeyword = this.normalizeText(keyword);
      if (!normalizedKeyword) {
        return;
      }
      if (normalized.includes(normalizedKeyword)) {
        score += normalizedKeyword.includes(' ') ? 3 : 2;
      } else {
        const keywordTokens = normalizedKeyword.split(' ').filter(Boolean);
        const overlap = keywordTokens.filter(token => inputTokens.includes(token)).length;
        score += overlap;
      }
    });

    if (normalized.includes('contact') || normalized.includes('support')) {
      score += intent.id === 'support' ? 2 : 0;
    }

    return score;
  }

  private intentToSuggestion(intentId: string): string | null {
    const map: Record<string, string> = {
      donate: 'Donation steps',
      receipt: 'Receipt PDF',
      anonymous: 'Anonymous donation',
      login: 'Reset password',
      'charity-signup': 'Charity signup',
      'charity-status': 'Charity status meaning',
      dashboard: 'Dashboard help',
      profile: 'Profile update rules',
      support: 'Open contact form',
      'donor-signup': 'Donor signup'
    };
    return map[intentId] || null;
  }

  private normalizeText(value: string): string {
    return (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private sharedWordCount(source: string, target: string): number {
    const src = new Set(source.split(' ').filter(Boolean));
    const tgt = new Set(target.split(' ').filter(Boolean));
    let count = 0;
    src.forEach(word => {
      if (tgt.has(word)) {
        count++;
      }
    });
    return count;
  }

  private handleHelpAction(value: string): boolean {
    const normalized = this.normalizeText(value);
    if (normalized === 'open contact form' || normalized === 'contact support' || normalized === 'contact') {
      this.openContact();
      return true;
    }
    if (normalized === 'open faq' || normalized === 'faq') {
      this.openFaq();
      return true;
    }
    if (normalized === 'clear chat') {
      this.resetHelpChat();
      return true;
    }
    return false;
  }

  resetHelpChat(): void {
    this.helpMessages = [
      {
        role: 'bot',
        text: 'Hi, I am the CareFund help assistant.\nTry asking about donation steps, receipt PDF, login reset, charity approval, dashboard reports, or profile rules.',
        time: this.formatHelpTime()
      }
    ];
    this.helpSuggested = [...this.quickHelpSuggestions];
    this.scrollHelpToBottom();
  }

  private scrollHelpToBottom(): void {
    if (!this.helpChatBody) {
      return;
    }
    setTimeout(() => {
      const el = this.helpChatBody?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }

  private formatHelpTime(): string {
    return new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  submitContact(): void {
    if (!this.contactForm.email.trim() || !this.contactForm.reason.trim()) {
      return;
    }

    this.contactSubmitted = true;
    this.contactForm = { email: '', reason: '' };
  }
}
