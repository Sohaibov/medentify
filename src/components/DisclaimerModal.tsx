import React from "react";
import { useTranslation } from "react-i18next";

export function DisclaimerModal({ open, onAccept }: { open: boolean; onAccept: () => void }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  return open ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      style={{ direction: dir }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 text-[#0C2D48] relative">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isArabic ? "تنبيه وإخلاء مسؤولية" : "Disclaimer"}
        </h2>
        <div className="text-[#333333] text-base mb-4 whitespace-pre-line" style={{ textAlign: isArabic ? "right" : "left" }}>
          {isArabic ? (
            <>
              منصة <b>Medentify</b> للتعرف على الحبوب الدوائية
              <br /><br />
              المعلومات التي تقدمها منصة Medentify هي لأغراض مرجعية وتثقيفية فقط، ولا يُقصد بها أن تحل محل الاستشارة الطبية المتخصصة أو التشخيص أو العلاج.
              <br /><br />
              على الرغم من سعينا لتوفير معلومات دقيقة، فإن Medentify:
              <br />
              • لا تضمن أن تكون نتائج التعرف على الحبوب صحيحة بنسبة 100%<br />
              • لا تقدم تشخيصًا طبيًا أو توصيات دوائية<br />
              • لا يجب الاعتماد عليها كمرجع وحيد في اتخاذ القرارات الطبية<br />
              قد يختلف شكل الحبوب (اللون، النقش، الشكل) حسب الشركة المصنعة أو ظروف التخزين أو الإضاءة.
              في حال وجود شك حول أي دواء، يرجى استشارة صيدلي أو طبيب مختص فورًا.
              <br /><br />
              بالضغط على "موافقة"، فإنك تقرّ وتوافق على ما يلي:
              <br />
              • أنت تدرك أن هذه المنصة ليست بديلاً عن الاستشارة الطبية.<br />
              • ستقوم بالرجوع إلى مختص صحي في حال وجود أي استفسار أو قلق بخصوص الأدوية.
            </>
          ) : (
            <>
              The information provided by <b>Medentify</b> is for informational and reference purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment.
              <br /><br />
              While we strive to maintain accuracy, Medentify:
              <br />
              • Does not guarantee that all pill identifications are 100% correct.<br />
              • Does not diagnose medical conditions or provide medication recommendations.<br />
              • Should not be used as the sole source for making medical decisions.<br />
              Medication appearance (color, shape, imprint) may vary depending on manufacturer, batch, lighting, and storage conditions. If you are unsure about any medication, consult a licensed pharmacist, physician, or healthcare provider immediately.
              <br /><br />
              By clicking “Accept,” you acknowledge and agree that:
              <br />
              • You understand this is not a substitute for medical consultation.<br />
              • You will consult a healthcare professional for any concerns about medications.
            </>
          )}
        </div>
        <button
          className="block mx-auto mt-4 px-6 py-2 rounded font-semibold bg-[#1C75BC] text-white border border-[#1C75BC] hover:bg-[#135C9C] transition"
          onClick={onAccept}
        >
          {isArabic ? "موافقة والاستمرار" : "Accept & Continue"}
        </button>
      </div>
    </div>
  ) : null;
}
