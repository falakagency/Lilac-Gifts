/**
 * Lilac Gifts - Google Apps Script Webhook
 * يستقبل الطلبات من الموقع ويسجّلها في Google Sheet
 *
 * كيف تستخدميه:
 * 1. افتحي الشيت: https://docs.google.com/spreadsheets/d/1lai1FM_uowx0Sp5E2jTFRD5ZBPa-Vb2Gkbwq5nw9AAk/edit
 * 2. من القائمة: Extensions → Apps Script
 * 3. احذفي أي كود موجود والصقي هذا الكود كاملاً
 * 4. اضغطي Save (💾)
 * 5. اضغطي Deploy → New deployment
 * 6. اختاري النوع: Web app
 * 7. Execute as: Me (إيميلك)
 * 8. Who has access: Anyone
 * 9. اضغطي Deploy ووافقي على الصلاحيات
 * 10. انسخي الـ Web app URL وأرسليه لي لربطه بالموقع
 */

const SHEET_ID = '1lai1FM_uowx0Sp5E2jTFRD5ZBPa-Vb2Gkbwq5nw9AAk';
const SHEET_NAME = 'Orders';

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.orderNumber || '',
      data.customerName || '',
      data.customerPhone || '',
      data.products || '',
      data.total || '',
      data.delivery || '',
      data.payment || '',
      data.notes || '',
      data.dateTime || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Lilac Gifts webhook is live', sheet: SHEET_ID }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'التاريخ',
      'رقم الطلب',
      'الاسم',
      'الهاتف',
      'المنتجات',
      'المجموع',
      'التوصيل',
      'الدفع',
      'ملاحظات',
      'وقت الطلب',
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#EDE0F7');
  }
  return sheet;
}
