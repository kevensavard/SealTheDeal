# Mailgun Email Setup Guide for SealTheDeal

## 1. Create Mailgun Account

1. **Go to Mailgun** (https://www.mailgun.com)
2. **Sign up for a free account**
3. **Verify your email address**

## 2. Get Your API Key

1. **Go to Mailgun Dashboard** → Settings → API Keys
2. **Copy your Private API Key** (starts with `key-`)
3. **Keep this secure** - you'll need it for environment variables

## 3. Set Up Your Domain

### Option A: Use Mailgun's Sandbox Domain (For Testing)
1. **Go to Mailgun Dashboard** → Sending → Domains
2. **Use the default sandbox domain** (e.g., `sandbox-123.mailgun.org`)
3. **Note the domain name** for environment variables

### Option B: Add Your Own Domain (Recommended for Production)
1. **Go to Mailgun Dashboard** → Sending → Domains
2. **Click "Add New Domain"**
3. **Enter your domain**: `mg.sealthedeal.app` (or similar)
4. **Follow DNS setup instructions**:
   - Add MX records
   - Add TXT records for verification
   - Add CNAME records for tracking
5. **Verify domain** once DNS propagates

## 4. Environment Variables

Add these to your Vercel environment variables:

```
MAILGUN_API_KEY=key-your-api-key-here
MAILGUN_DOMAIN=your-domain.mailgun.org
NEXT_PUBLIC_APP_URL=https://sealthedeal.app
```

## 5. Test Email Sending

1. **Deploy your app** with the new environment variables
2. **Create a test contract** in your app
3. **Send it for e-signature** to your own email
4. **Check your email** for the signing link
5. **Test the signing process**

## 6. Mailgun Free Tier Limits

- **5,000 emails/month** for first 3 months
- **100 emails/day** after that
- **Perfect for testing and small businesses**

## 7. Production Considerations

### Domain Authentication
- **Set up SPF records** for better deliverability
- **Add DKIM signatures** (Mailgun handles this)
- **Consider DMARC policy** for advanced protection

### Monitoring
- **Check Mailgun logs** for delivery issues
- **Monitor bounce rates** and spam complaints
- **Set up webhooks** for delivery events (optional)

### Scaling
- **Upgrade to paid plan** when you exceed free limits
- **Consider dedicated IP** for high volume
- **Implement email queuing** for large batches

## 8. Troubleshooting

### Common Issues:
1. **"Domain not verified"** - Check DNS records
2. **"API key invalid"** - Verify the key is correct
3. **"From address not authorized"** - Use verified domain
4. **Emails going to spam** - Set up proper DNS records

### Testing Commands:
```bash
# Test API key
curl -s --user 'api:YOUR_API_KEY' \
    https://api.mailgun.net/v3/YOUR_DOMAIN/messages \
    -F from='test@YOUR_DOMAIN' \
    -F to='your-email@example.com' \
    -F subject='Test Email' \
    -F text='This is a test email from Mailgun'
```

## 9. Security Best Practices

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Rotate API keys** periodically
- **Monitor usage** for unusual activity
- **Set up rate limiting** in your app

## 10. Next Steps

Once Mailgun is configured:
1. **Test the e-signature flow** end-to-end
2. **Verify email templates** look good
3. **Test with different email providers** (Gmail, Outlook, etc.)
4. **Monitor delivery rates** and user feedback
5. **Consider adding email analytics** for insights

Your SealTheDeal app will now be able to send professional contract signing emails with beautiful templates!
