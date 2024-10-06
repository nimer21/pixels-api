import img_terms from "../assets/img/Terms.png";
const Analytics = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="w-full object-cover md:w-48 mt-14"
            src={img_terms}
            alt="Project Goal"
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-lg text-indigo-500 font-extrabold text-center">
            الشروط
          </div>
          <p className="mt-2 text-slate-500 text-justify">
            <a
              href="#"
              className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
            >
              في حال أردتم استئجار "مساحة إعلان" لعرض منتجكم المحلي في الفضاء الذي تحتويه شبكة المنتجات المحلية هذه، يجب أن تكونوا على اطلاع بالشروط التالية:
            </a>      
          </p>
          <ol className="list-decimal">
            <li className="mt-2 text-slate-500 text-justify">
            شبكة المنتجات المحلّية هذه مقسمة إلى مجموعةٍ كبيرةٍ من "مساحات الإعلانات" أو "خلايا الإعلانات"، الخلية الواحدة فيها (المتمثلة بمربعٍ واحدٍ ويطلق عليه مصطلح "خلية إعلانية") تُؤجّر لعرضِ إعلانٍ واحدٍ ب: 140 دينار أردني (حتى نهاية العام 2024م، ثم تعود إلى سعرها: 150 دينار أردني)، كأقل مساحةٍ يمكن تأجيرها على شبكة المنتجات المحلية، كذلك، فإن أكثر ما يمكن تأجيره من مساحات الشبكة لصالح الإعلان الواحد يتمثل في تأجير: 90 خلية إعلانية - الخلية الواحدة بِ: 140 دينار أردني - .. على أن يستمر عرض الإعلانات كلها على هذا الموقع حتى لحظة الدخول في العام 2030 للميلاد، إذ تتوقف لحظتها الإعلانات المعروضة في فضاء المنتجات المحلية هذا جميعها.
            </li>
            <li className="mt-2 text-slate-500 text-justify">
            تأجير "مساحات الإعلانات" أو "الخلايا الإعلانية" فقط لمن يودّ عرض منتجٍ محليّ غير داعم للاحتلال المغروس في قلب الوطن العربي. وعليه، إن قامت شركة ما بعرض إعلانها في فضاء المنتجات الوطنية المحلية ثم تبيّن دعمها المادي للاحتلال في أيّ وقتٍ من لحظة عرض إعلانها وحتى انتهاء فترة العرض (بدء العام 2030م)؛ سيتم وقف عرض الإعلان الخاص بها، وستفقد الحق في استئجار أي مساحة إعلانٍ أخرى على الموقع لاحقاً، وسيتم إعادة طرح تلك المساحة بعد عودتها مساحةً فارغة للتأجير لصالح إعلانٍ جديد.
            </li>
            <li className="mt-2 text-slate-500 text-justify">
            الشركة التي تستأجر مساحةً واحدةً (خلية) أو أكثر ضمن هذا الفضاء، لا يمكن لها تغيير إعلانها - المتّفق عليه- بعد عَرضه على الموقع واستبداله بآخر، أو تغيير رابط الإعلان الذي تم استئجار المِساحة لأجله، خلال الفترة المتفق عليها لعرض الإعلان في النقاط السابقة. (إن شاءت الشركة إيقاف تفعيل الرابط الموصول بصورة منتجها المعروضة في فضاء المنتجات المحلّية، أو إبقاؤه يعمل، هذا حقها الخالص، لكن لا يمكن تغييره واستبداله بغيره) مع التأكيد على حقها في شراء مساحاتٍ/ خلايا إعلانيّة جديدة في حال امتلاكها لأكثر من منتجٍ محلّي تودّ عرضه في هذا الفضاء الكبير الملوّن بكل ما هو محليّ.
            </li>
          </ol>          
        </div>
      </div>
    </div>
  );
};
export default Analytics;
