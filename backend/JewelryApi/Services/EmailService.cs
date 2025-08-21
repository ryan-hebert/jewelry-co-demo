using SendGrid;
using SendGrid.Helpers.Mail;
using JewelryApi.Models;

namespace JewelryApi.Services;

/// <summary>
/// Service for sending email notifications
/// </summary>
public class EmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Sends an order confirmation email to the customer
    /// </summary>
    public async Task<bool> SendOrderConfirmationAsync(Order order)
    {
        try
        {
            var apiKey = _configuration["SendGrid:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogWarning("SendGrid API key not configured. Skipping email send.");
                return false;
            }

            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(_configuration["SendGrid:FromEmail"] ?? "noreply@jewelrydemo.com", "Ryan H Jewelry Co.");
            var to = new EmailAddress(order.CustomerEmail, order.CustomerName);
            var subject = $"Order Confirmation - #{order.Id}";
            var htmlContent = GenerateOrderConfirmationHtml(order);
            var plainTextContent = GenerateOrderConfirmationText(order);

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Order confirmation email sent successfully to {Email}", order.CustomerEmail);
                return true;
            }
            else
            {
                _logger.LogError("Failed to send order confirmation email. Status: {Status}", response.StatusCode);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending order confirmation email");
            return false;
        }
    }

    private string GenerateOrderConfirmationHtml(Order order)
    {
        var itemsHtml = string.Join("", order.Items.Select(item => $@"
            <tr>
                <td style='padding: 12px; border-bottom: 1px solid #e5e7eb;'>
                    <strong>{item.ProductName}</strong><br>
                    <small style='color: #6b7280;'>
                        Metal: {item.Metal} • Stone: {item.Stone} • Carat: {item.CaratSize} • Ring Size: {item.RingSize}
                    </small>
                </td>
                <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;'>
                    ${item.Price:F2}
                </td>
            </tr>"));

        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <title>Order Confirmation</title>
            </head>
            <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 20px; background-color: #f8fafc;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);'>
                    <!-- Header -->
                    <div style='background-color: #2069ae; color: white; padding: 30px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 24px;'>Ryan H Jewelry Co.</h1>
                        <p style='margin: 10px 0 0 0; opacity: 0.9;'>Order Confirmation</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px;'>
                        <div style='text-align: center; margin-bottom: 30px;'>
                            <div style='background-color: #2b9762; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px;'>
                                ✓
                            </div>
                            <h2 style='margin: 0; color: #2b9762;'>Order Confirmed!</h2>
                            <p style='margin: 10px 0 0 0; color: #6b7280;'>Thank you for your purchase. Your order has been successfully placed.</p>
                        </div>

                        <!-- Order Details -->
                        <div style='background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px;'>
                            <h3 style='margin: 0 0 15px 0; color: #1f2937;'>Order Information</h3>
                            <div style='display: grid; gap: 8px; font-size: 14px;'>
                                <div style='display: flex; justify-content: space-between;'>
                                    <span style='color: #6b7280;'>Order ID:</span>
                                    <span style='font-weight: 500;'>{order.Id}</span>
                                </div>
                                <div style='display: flex; justify-content: space-between;'>
                                    <span style='color: #6b7280;'>Order Date:</span>
                                    <span style='font-weight: 500;'>{order.CreatedAt:MMMM dd, yyyy 'at' h:mm tt}</span>
                                </div>
                                <div style='display: flex; justify-content: space-between;'>
                                    <span style='color: #6b7280;'>Customer:</span>
                                    <span style='font-weight: 500;'>{order.CustomerName}</span>
                                </div>
                                <div style='display: flex; justify-content: space-between;'>
                                    <span style='color: #6b7280;'>Email:</span>
                                    <span style='font-weight: 500;'>{order.CustomerEmail}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Order Items -->
                        <div style='margin-bottom: 30px;'>
                            <h3 style='margin: 0 0 15px 0; color: #1f2937;'>Items Ordered</h3>
                            <table style='width: 100%; border-collapse: collapse;'>
                                <thead>
                                    <tr style='background-color: #f8fafc;'>
                                        <th style='padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;'>Item</th>
                                        <th style='padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;'>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td style='padding: 12px; border-top: 2px solid #e5e7eb; font-weight: 600;'>Total</td>
                                        <td style='padding: 12px; border-top: 2px solid #e5e7eb; text-align: right; font-weight: 600; font-size: 18px; color: #2069ae;'>
                                            ${order.Total:F2}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <!-- Footer -->
                        <div style='text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;'>
                            <p style='margin: 0; color: #6b7280; font-size: 14px;'>
                                If you have any questions about your order, please contact us at<br>
                                <strong>337-290-5522</strong> or email us at <strong>info@ryanhjewelry.com</strong>
                            </p>
                            <p style='margin: 15px 0 0 0; color: #6b7280; font-size: 12px;'>
                                Weekdays 8AM–7PM CST
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>";
    }

    private string GenerateOrderConfirmationText(Order order)
    {
        var itemsText = string.Join("\n", order.Items.Select(item => 
            $"- {item.ProductName} ({item.Metal}, {item.Stone}, {item.CaratSize}, Ring Size {item.RingSize}): ${item.Price:F2}"));

        return $@"
ORDER CONFIRMATION

Thank you for your purchase from Ryan H Jewelry Co.!

Order Details:
- Order ID: {order.Id}
- Order Date: {order.CreatedAt:MMMM dd, yyyy 'at' h:mm tt}
- Customer: {order.CustomerName}
- Email: {order.CustomerEmail}

Items Ordered:
{itemsText}

Total: ${order.Total:F2}

If you have any questions about your order, please contact us at 337-290-5522 or email us at info@ryanhjewelry.com.

Weekdays 8AM–7PM CST

Thank you for choosing Ryan H Jewelry Co.!";
    }
}
