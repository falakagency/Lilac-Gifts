/**
 * Lilac Gifts - Google Apps Script Webhook
 * يستقبل الطلبات من الموقع ويسجّلها في Google Sheet
 * ويسمح بإلغاء الطلبات عبر تحديث عمود الحالة
 */

const SHEET_ID = '1lai1FM_uowx0Sp5E2jTFRD5ZBPa-Vb2Gkbwq5nw9AAk';
const SHEET_NAME = 'Orders';
const STATUS_ACTIVE = 'نشط 🟢';
const STATUS_CANCELLED = 'ملغي 🔴';

const HEADERS = [
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
  'الحالة',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'create';

    if (action === 'cancel') {
      return cancelOrder(data.orderNumber);
    }
    return createOrder(data);
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({ status: 'Lilac Gifts webhook is live' });
}

function createOrder(data) {
  const sheet = getOrCreateSheet();
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
    STATUS_ACTIVE,
  ]);
  return jsonResponse({ success: true });
}

function cancelOrder(orderNumber) {
  if (!orderNumber) {
    return jsonResponse({ success: false, error: 'orderNumber required' });
  }
  const sheet = getOrCreateSheet();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]).trim() === String(orderNumber).trim()) {
      sheet.getRange(i + 1, 11).setValue(STATUS_CANCELLED);
      return jsonResponse({ success: true, row: i + 1 });
    }
  }
  return jsonResponse({ success: false, error: 'order not found' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#EDE0F7');
    return sheet;
  }
  const lastCol = sheet.getLastColumn();
  if (lastCol < 11) {
    sheet.getRange(1, 11).setValue('الحالة').setFontWeight('bold').setBackground('#EDE0F7');
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const fill = [];
      for (let i = 0; i < lastRow - 1; i++) fill.push([STATUS_ACTIVE]);
      sheet.getRange(2, 11, lastRow - 1, 1).setValues(fill);
    }
  }
  return sheet;
}
