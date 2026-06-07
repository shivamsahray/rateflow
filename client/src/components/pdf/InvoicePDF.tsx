// import {
//   Document,
//   Page,
//   Text,
//   View,
//   Image,
//   StyleSheet,
// } from "@react-pdf/renderer";

// const ones = [
//   "",
//   "One",
//   "Two",
//   "Three",
//   "Four",
//   "Five",
//   "Six",
//   "Seven",
//   "Eight",
//   "Nine",
//   "Ten",
//   "Eleven",
//   "Twelve",
//   "Thirteen",
//   "Fourteen",
//   "Fifteen",
//   "Sixteen",
//   "Seventeen",
//   "Eighteen",
//   "Nineteen",
// ];

// const tens = [
//   "",
//   "",
//   "Twenty",
//   "Thirty",
//   "Forty",
//   "Fifty",
//   "Sixty",
//   "Seventy",
//   "Eighty",
//   "Ninety",
// ];

// const convertLessThanThousand = (
//   amount: number
// ) => {
//   let words = "";

//   if (amount >= 100) {
//     words +=
//       `${ones[Math.floor(amount / 100)]} Hundred`;

//     amount %= 100;

//     if (amount) {
//       words += " ";
//     }
//   }

//   if (amount >= 20) {
//     words +=
//       tens[Math.floor(amount / 10)];

//     amount %= 10;

//     if (amount) {
//       words +=
//         ` ${ones[amount]}`;
//     }
//   } else if (amount > 0) {
//     words +=
//       ones[amount];
//   }

//   return words;
// };

// const convertNumberToWords = (
//   amount: number
// ) => {
//   if (amount === 0) {
//     return "Zero";
//   }

//   const parts = [
//     {
//       value: 10000000,
//       label: "Crore",
//     },
//     {
//       value: 100000,
//       label: "Lakh",
//     },
//     {
//       value: 1000,
//       label: "Thousand",
//     },
//     {
//       value: 1,
//       label: "",
//     },
//   ];

//   let remaining = amount;
//   const words: string[] = [];

//   for (const part of parts) {
//     const count =
//       Math.floor(
//         remaining / part.value
//       );

//     if (count) {
//       words.push(
//         `${convertLessThanThousand(count)} ${part.label}`.trim()
//       );

//       remaining %= part.value;
//     }
//   }

//   return words.join(" ");
// };

// const convertAmountToWords = (
//   amount: number
// ) => {
//   const rupees =
//     Math.floor(amount);

//   const paise =
//     Math.round(
//       (amount - rupees) * 100
//     );

//   const rupeeWords =
//     `${convertNumberToWords(rupees)} Rupees`;

//   if (!paise) {
//     return `${rupeeWords} Only`;
//   }

//   return `${rupeeWords} and ${convertNumberToWords(paise)} Paise Only`;
// };

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 12,
//     border: 1,
//     borderColor: "#D1D5DB",
//   },

//   headerContainer: {
//     border: 1,
//     borderColor: "#000",
//     padding: 10,
//     marginBottom: 20,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },

//   logo: {
//     width: 80,
//     height: 60,
//     objectFit: "contain",
//     marginRight: 12,
//   },

//   companyBlock: {
//     flexDirection: "row",
//     flex: 1,
//   },

//   companyInfo: {
//     flex: 1,
//   },

//   companyName: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },

//   invoiceInfo: {
//     width: 220,
//   },

//   section: {
//     marginBottom: 15,
//   },

//   title: {
//     fontSize: 18,
//     marginBottom: 10,
//     textAlign: "center",
//   },

//   invoiceInfoRow: {
//     flexDirection: "row",
//     marginBottom: 5,
//   },

//   invoiceInfoLabel: {
//     width: 90,
//     fontWeight: "bold",
//   },

//   table: {
//     width: "100%",
//     marginTop: 10,
//     border: 1,
//     borderColor: "#ddd",
//   },

//   row: {
//     flexDirection: "row",
//     borderBottom: 1,
//     borderColor: "#ddd",
//     paddingVertical: 6,
//   },

//   cell: {
//     flex: 1,
//   },

//   productCell: {
//     flex: 2,
//   },

//   smallCell: {
//     flex: 0.8,
//   },

//   tableHeader: {
//     backgroundColor: "#E5E7EB",
//     fontWeight: "bold",
//   },

//   summary: {
//     marginTop: 20,
//     alignSelf: "flex-end",
//     width: 220,
//   },

//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 5,
//   },

//   grandTotal: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//   },

//   amountWords: {
//     marginTop: 16,
//     padding: 10,
//     border: 1,
//     borderColor: "#E5E7EB",
//   },

//   amountWordsTitle: {
//     fontWeight: "bold",
//     marginBottom: 4,
//   },

//   terms: {
//     marginTop: 40,
//   },

//   termsTitle: {
//     fontSize: 14,
//     marginBottom: 10,
//   },

//   signature: {
//     marginTop: 60,
//     alignItems: "flex-end",
//     borderTop: 1,
//     borderColor: "#000",
//     paddingTop: 15,
//   },

//   signatureImage: {
//     width: 140,
//     height: 70,
//     objectFit: "contain",
//     marginVertical: 8,
//   },

//   footer: {
//     position: "absolute",
//     bottom: 18,
//     left: 30,
//     right: 30,
//     borderTop: 1,
//     borderColor: "#D1D5DB",
//     paddingTop: 8,
//     textAlign: "center",
//     color: "#4B5563",
//     fontSize: 10,
//   },
// });

// interface Props {
//   invoice: any;
// }

// export default function InvoicePDF({
//   invoice,
// }: Props) {

//   const subtotal =
//     invoice.items.reduce(
//       (
//         sum: number,
//         item: any
//       ) =>
//         sum +
//         item.quantity *
//         item.price,
//       0
//     );

//   const gstTotal =
//     invoice.items.reduce(
//       (sum: number, item: any) =>
//         sum +
//         (
//           item.quantity *
//           item.price *
//           (item.gstPercent || 0)
//         ) / 100,
//       0
//     );

//   const grandTotal =
//     subtotal + gstTotal;

//   const amountInWords =
//     convertAmountToWords(
//       grandTotal
//     );

//   const tenant =
//     typeof invoice.tenantId === "object"
//       ? invoice.tenantId
//       : {};

//   return (
//     <Document>

//       <Page
//         size="A4"
//         style={styles.page}
//       >

//         <View style={styles.headerContainer}>

//           <View style={styles.header}>

//             <View style={styles.companyBlock}>

//               {tenant?.logo && (
//                 <Image
//                   src={tenant.logo}
//                   style={styles.logo}
//                 />
//               )}

//               <View style={styles.companyInfo}>

//                 <Text
//                   style={styles.companyName}
//                 >
//                   {
//                     tenant?.companyName
//                   }
//                 </Text>

//                 <Text>
//                   GSTIN:
//                   {" "}
//                   {
//                     tenant?.gstNumber
//                   }
//                 </Text>

//                 <Text>
//                   Phone:
//                   {" "}
//                   {
//                     tenant?.phone
//                   }
//                 </Text>

//                 {tenant?.email && (
//                   <Text>
//                     Email:
//                     {" "}
//                     {
//                       tenant.email
//                     }
//                   </Text>
//                 )}

//                 {tenant?.address && (
//                   <Text>
//                     Address:
//                     {" "}
//                     {
//                       tenant.address
//                     }
//                   </Text>
//                 )}

//               </View>

//             </View>

//             <View style={styles.invoiceInfo}>

//               <Text
//                 style={styles.title}
//               >
//                 TAX INVOICE
//               </Text>

//               <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Invoice No
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   {
//                     invoice.invoiceNumber
//                   }
//                 </Text>
//               </View>

//               <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Date
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   {
//                     new Date(
//                       invoice.createdAt
//                     )
//                       .toLocaleDateString(
//                         "en-IN"
//                       )
//                   }
//                 </Text>
//               </View>

//               <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Status
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   {
//                     invoice.paymentStatus ||
//                     "Pending"
//                   }
//                 </Text>
//               </View>

//               <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Amount Due
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   Rs.
//                   {" "}
//                   {
//                     grandTotal.toFixed(2)
//                   }
//                 </Text>
//               </View>

//             </View>

//           </View>

//         </View>

//         <View
//           style={styles.section}
//         >

//           <Text>
//             Bill To:
//           </Text>

//           <Text>
//             {
//               invoice.customerId
//                 ?.name
//             }
//           </Text>

//           <Text>
//             GSTIN:
//             {" "}
//             {
//               invoice.customerId
//                 ?.gstNumber
//             }
//           </Text>

//           <Text>
//             Phone:
//             {" "}
//             {
//               invoice.customerId
//                 ?.phone
//             }
//           </Text>

//           <Text>
//             {
//               invoice.customerId
//                 ?.address
//             }
//           </Text>

//         </View>

//         <View style={styles.table}>

//           <View
//             style={[
//               styles.row,
//               styles.tableHeader,
//             ]}
//           >

//             <Text
//               style={styles.productCell}
//             >
//               Product
//             </Text>

//             <Text
//               style={styles.smallCell}
//             >
//               Qty
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               Rate
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               Taxable
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               GST
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               Amount
//             </Text>

//           </View>

//           {invoice.items.map(
//             (
//               item: any,
//               index: number
//             ) => (

//               <View
//                 key={index}
//                 style={styles.row}
//               >

//                 <Text
//                   style={styles.productCell}
//                 >
//                   {
//                     item.productId
//                       ?.name
//                   }
//                 </Text>

//                 <Text
//                   style={styles.smallCell}
//                 >
//                   {
//                     item.quantity
//                   }
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {item.price}
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {
//                     (
//                       item.quantity *
//                       item.price
//                     ).toFixed(2)
//                   }
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {
//                     (
//                       item.quantity *
//                       item.price *
//                       (item.gstPercent || 0)
//                     / 100
//                     ).toFixed(2)
//                   }
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {
//                     (
//                       (item.quantity * item.price) +
//                       (
//                         item.quantity *
//                         item.price *
//                         (item.gstPercent || 0)
//                       ) / 100
//                     ).toFixed(2)
//                   }
//                 </Text>

//               </View>

//             )
//           )}

//         </View>

//         <View
//           style={styles.summary}
//         >

//           <View
//             style={
//               styles.summaryRow
//             }
//           >
//             <Text>
//               Subtotal
//             </Text>

//             <Text>
//               Rs.
//               {
//                 subtotal.toFixed(2)
//               }
//             </Text>
//           </View>

//           <View
//             style={
//               styles.summaryRow
//             }
//           >
//             <Text>
//               GST
//             </Text>

//             <Text>
//               Rs.
//               {
//                 gstTotal.toFixed(2)
//               }
//             </Text>
//           </View>

//           <View
//             style={
//               styles.summaryRow
//             }
//           >
//             <Text
//               style={
//                 styles.grandTotal
//               }
//             >
//               Grand Total
//             </Text>

//             <Text
//               style={
//                 styles.grandTotal
//               }
//             >
//               Rs.
//               {" "}
//               {
//                 grandTotal.toFixed(2)
//               }
//             </Text>
//           </View>

//         </View>

//         <View style={styles.amountWords}>

//           <Text style={styles.amountWordsTitle}>
//             Amount in Words:
//           </Text>

//           <Text>
//             {amountInWords}
//           </Text>

//         </View>

//         <View
//           style={styles.terms}
//         >

//           <Text
//             style={styles.termsTitle}
//           >
//             Terms & Conditions
//           </Text>

//           <Text>
//             1. Goods once sold will not be taken back.
//           </Text>

//           <Text>
//             2. Subject to Gurugram jurisdiction.
//           </Text>

//           <Text>
//             3. Payment due within agreed credit period.
//           </Text>

//           <Text>
//             4. Interest may apply on overdue balances.
//           </Text>

//         </View>

//         <View
//           style={styles.signature}
//         >

//           <Text>
//             For
//             {" "}
//             {
//               tenant?.companyName
//             }
//           </Text>

//           {tenant?.signature && (
//             <Image
//               src={tenant.signature}
//               style={styles.signatureImage}
//             />
//           )}

//           <Text>
//             Authorized Signatory
//           </Text>

//         </View>

//         <View style={styles.footer}>

//           <Text>
//             Generated by RateFlow ERP
//           </Text>

//           <Text>
//             www.rateflow.in
//           </Text>

//         </View>

//       </Page>

//     </Document>
//   );
// }


// import {
//   Document,
//   Page,
//   Text,
//   View,
//   Image,
//   StyleSheet,
// } from "@react-pdf/renderer";

// const ones = [
//   "",
//   "One",
//   "Two",
//   "Three",
//   "Four",
//   "Five",
//   "Six",
//   "Seven",
//   "Eight",
//   "Nine",
//   "Ten",
//   "Eleven",
//   "Twelve",
//   "Thirteen",
//   "Fourteen",
//   "Fifteen",
//   "Sixteen",
//   "Seventeen",
//   "Eighteen",
//   "Nineteen",
// ];

// const tens = [
//   "",
//   "",
//   "Twenty",
//   "Thirty",
//   "Forty",
//   "Fifty",
//   "Sixty",
//   "Seventy",
//   "Eighty",
//   "Ninety",
// ];

// const convertLessThanThousand = (
//   amount: number
// ) => {
//   let words = "";

//   if (amount >= 100) {
//     words +=
//       `${ones[Math.floor(amount / 100)]} Hundred`;

//     amount %= 100;

//     if (amount) {
//       words += " ";
//     }
//   }

//   if (amount >= 20) {
//     words +=
//       tens[Math.floor(amount / 10)];

//     amount %= 10;

//     if (amount) {
//       words +=
//         ` ${ones[amount]}`;
//     }
//   } else if (amount > 0) {
//     words +=
//       ones[amount];
//   }

//   return words;
// };

// const convertNumberToWords = (
//   amount: number
// ) => {
//   if (amount === 0) {
//     return "Zero";
//   }

//   const parts = [
//     {
//       value: 10000000,
//       label: "Crore",
//     },
//     {
//       value: 100000,
//       label: "Lakh",
//     },
//     {
//       value: 1000,
//       label: "Thousand",
//     },
//     {
//       value: 1,
//       label: "",
//     },
//   ];

//   let remaining = amount;
//   const words: string[] = [];

//   for (const part of parts) {
//     const count =
//       Math.floor(
//         remaining / part.value
//       );

//     if (count) {
//       words.push(
//         `${convertLessThanThousand(count)} ${part.label}`.trim()
//       );

//       remaining %= part.value;
//     }
//   }

//   return words.join(" ");
// };

// const convertAmountToWords = (
//   amount: number
// ) => {
//   const rupees =
//     Math.floor(amount);

//   const paise =
//     Math.round(
//       (amount - rupees) * 100
//     );

//   const rupeeWords =
//     `${convertNumberToWords(rupees)} Rupees`;

//   if (!paise) {
//     return `${rupeeWords} Only`;
//   }

//   return `${rupeeWords} and ${convertNumberToWords(paise)} Paise Only`;
// };

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 12,
//     border: 1,
//     borderColor: "#D1D5DB",
//   },

//   headerContainer: {
//     border: 1,
//     borderColor: "#000",
//     padding: 10,
//     marginBottom: 20,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },

//   logo: {
//     width: 80,
//     height: 60,
//     objectFit: "contain",
//     marginRight: 12,
//   },

//   companyBlock: {
//     flexDirection: "row",
//     flex: 1,
//   },

//   companyInfo: {
//     flex: 1,
//   },

//   companyName: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },

//   invoiceInfo: {
//     width: 220,
//   },

//   section: {
//     marginBottom: 15,
//   },

//   title: {
//     fontSize: 18,
//     marginBottom: 10,
//     textAlign: "center",
//   },

//   invoiceInfoRow: {
//     flexDirection: "row",
//     marginBottom: 5,
//   },

//   invoiceInfoLabel: {
//     width: 90,
//     fontWeight: "bold",
//   },

//   table: {
//     width: "100%",
//     marginTop: 10,
//     border: 1,
//     borderColor: "#ddd",
//   },

//   row: {
//     flexDirection: "row",
//     borderBottom: 1,
//     borderColor: "#ddd",
//     paddingVertical: 6,
//   },

//   cell: {
//     flex: 1,
//   },

//   productCell: {
//     flex: 2,
//   },

//   smallCell: {
//     flex: 0.8,
//   },

//   tableHeader: {
//     backgroundColor: "#E5E7EB",
//     fontWeight: "bold",
//   },

//   summary: {
//     marginTop: 20,
//     alignSelf: "flex-end",
//     width: 220,
//   },

//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 5,
//   },

//   grandTotal: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//   },

//   amountWords: {
//     marginTop: 16,
//     padding: 10,
//     border: 1,
//     borderColor: "#E5E7EB",
//   },

//   amountWordsTitle: {
//     fontWeight: "bold",
//     marginBottom: 4,
//   },

//   terms: {
//     marginTop: 40,
//   },

//   termsTitle: {
//     fontSize: 14,
//     marginBottom: 10,
//   },

//   signature: {
//     marginTop: 60,
//     alignItems: "flex-end",
//     borderTop: 1,
//     borderColor: "#000",
//     paddingTop: 15,
//   },

//   signatureImage: {
//     width: 140,
//     height: 70,
//     objectFit: "contain",
//     marginVertical: 8,
//   },

//   footer: {
//     position: "absolute",
//     bottom: 18,
//     left: 30,
//     right: 30,
//     borderTop: 1,
//     borderColor: "#D1D5DB",
//     paddingTop: 8,
//     textAlign: "center",
//     color: "#4B5563",
//     fontSize: 10,
//   },
// });

// interface Props {
//   invoice: any;
// }

// export default function InvoicePDF({
//   invoice,
// }: Props) {

//   const subtotal =
//     invoice.items.reduce(
//       (
//         sum: number,
//         item: any
//       ) =>
//         sum +
//         item.quantity *
//         item.price,
//       0
//     );

//   const gstTotal =
//     invoice.items.reduce(
//       (sum: number, item: any) =>
//         sum +
//         (
//           item.quantity *
//           item.price *
//           (item.gstPercent || 0)
//         ) / 100,
//       0
//     );

//   const grandTotal =
//     subtotal + gstTotal;

//   const amountInWords =
//     convertAmountToWords(
//       grandTotal
//     );

//   const tenant =
//     typeof invoice.tenantId === "object"
//       ? invoice.tenantId
//       : {};

//   return (
//     <Document>

//       <Page
//         size="A4"
//         style={styles.page}
//       >

//         <View style={styles.headerContainer}>

//           <View style={styles.header}>

//             <View style={styles.companyBlock}>

//               {tenant?.logo && (
//                 <Image
//                   src={tenant.logo}
//                   style={styles.logo}
//                 />
//               )}

//               <View style={styles.companyInfo}>

//                 <Text
//                   style={styles.companyName}
//                 >
//                   {
//                     tenant?.companyName
//                   }
//                 </Text>

//                 <Text>
//                   GSTIN:
//                   {" "}
//                   {
//                     tenant?.gstNumber
//                   }
//                 </Text>

//                 <Text>
//                   Phone:
//                   {" "}
//                   {
//                     tenant?.phone
//                   }
//                 </Text>

//                 {tenant?.email && (
//                   <Text>
//                     Email:
//                     {" "}
//                     {
//                       tenant.email
//                     }
//                   </Text>
//                 )}

//                 {tenant?.address && (
//                   <Text>
//                     Address:
//                     {" "}
//                     {
//                       tenant.address
//                     }
//                   </Text>
//                 )}

//               </View>

//             </View>
//             <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Date
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   {
//                     new Date(
//                       invoice.createdAt
//                     )
//                       .toLocaleDateString(
//                         "en-IN"
//                       )
//                   }
//                 </Text>
//               </View>

//             <View style={styles.invoiceInfo}>

//               <Text
//                 style={styles.title}
//               >
//                 TAX INVOICE
//               </Text>

//               <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Invoice No
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   {
//                     invoice.invoiceNumber
//                   }
//                 </Text>
//               </View>

              

//               <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Vehicle No
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   {
//                     invoice.vehicleNumber ||
//                     "N/A"
//                   }
//                 </Text>
//               </View>

//               {/* <View style={styles.invoiceInfoRow}>
//                 <Text style={styles.invoiceInfoLabel}>
//                   Amount Due
//                 </Text>

//                 <Text>
//                   :
//                   {" "}
//                   Rs.
//                   {" "}
//                   {
//                     grandTotal.toFixed(2)
//                   }
//                 </Text>
//               </View> */}

//             </View>

//           </View>

//         </View>

//         <View
//           style={styles.section}
//         >

//           <Text>
//             Bill To:
//           </Text>

//           <Text>
//             {
//               invoice.customerId
//                 ?.name
//             }
//           </Text>

//           <Text>
//             GSTIN:
//             {" "}
//             {
//               invoice.customerId
//                 ?.gstNumber
//             }
//           </Text>

//           <Text>
//             Phone:
//             {" "}
//             {
//               invoice.customerId
//                 ?.phone
//             }
//           </Text>

//           <Text>
//             {
//               invoice.customerId
//                 ?.address
//             }
//           </Text>

          

//         </View>

//         <View style={styles.table}>

//           <View
//             style={[
//               styles.row,
//               styles.tableHeader,
//             ]}
//           >

//             <Text
//               style={styles.productCell}
//             >
//               Product
//             </Text>

//             <Text
//               style={styles.smallCell}
//             >
//               Qty
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               Rate
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               Taxable
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               GST
//             </Text>

//             <Text
//               style={styles.cell}
//             >
//               Amount
//             </Text>

//           </View>

//           {invoice.items.map(
//             (
//               item: any,
//               index: number
//             ) => (

//               <View
//                 key={index}
//                 style={styles.row}
//               >

//                 <Text
//                   style={styles.productCell}
//                 >
//                   {
//                     item.productId
//                       ?.name
//                   }
//                 </Text>

//                 <Text
//                   style={styles.smallCell}
//                 >
//                   {
//                     item.quantity
//                   }
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {item.price}
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {
//                     (
//                       item.quantity *
//                       item.price
//                     ).toFixed(2)
//                   }
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {
//                     (
//                       item.quantity *
//                       item.price *
//                       (item.gstPercent || 0)
//                     / 100
//                     ).toFixed(2)
//                   }
//                 </Text>

//                 <Text
//                   style={styles.cell}
//                 >
//                   Rs.
//                   {
//                     (
//                       (item.quantity * item.price) +
//                       (
//                         item.quantity *
//                         item.price *
//                         (item.gstPercent || 0)
//                       ) / 100
//                     ).toFixed(2)
//                   }
//                 </Text>

//               </View>

//             )
//           )}

//         </View>

//         <View
//           style={styles.summary}
//         >

//           <View
//             style={
//               styles.summaryRow
//             }
//           >
//             <Text>
//               Subtotal
//             </Text>

//             <Text>
//               Rs.
//               {
//                 subtotal.toFixed(2)
//               }
//             </Text>
//           </View>

//           <View
//             style={
//               styles.summaryRow
//             }
//           >
//             <Text>
//               GST
//             </Text>

//             <Text>
//               Rs.
//               {
//                 gstTotal.toFixed(2)
//               }
//             </Text>
//           </View>

//           <View
//             style={
//               styles.summaryRow
//             }
//           >
//             <Text
//               style={
//                 styles.grandTotal
//               }
//             >
//               Grand Total
//             </Text>

//             <Text
//               style={
//                 styles.grandTotal
//               }
//             >
//               Rs.
//               {" "}
//               {
//                 grandTotal.toFixed(2)
//               }
//             </Text>
//           </View>

//         </View>

//         <View style={styles.amountWords}>

//           <Text style={styles.amountWordsTitle}>
//             Amount in Words:
//           </Text>

//           <Text>
//             {amountInWords}
//           </Text>

//         </View>

//         <View
//           style={styles.terms}
//         >

//           <Text
//             style={styles.termsTitle}
//           >
//             Terms & Conditions
//           </Text>

//           <Text>
//             1. Goods once sold will not be taken back.
//           </Text>

//           <Text>
//             2. Subject to Gurugram jurisdiction.
//           </Text>

//           <Text>
//             3. Payment due within agreed credit period.
//           </Text>

//           <Text>
//             4. Interest may apply on overdue balances.
//           </Text>

//         </View>

//         <View
//           style={styles.signature}
//         >

//           <Text>
//             For
//             {" "}
//             {
//               tenant?.companyName
//             }
//           </Text>

//           {tenant?.signature && (
//             <Image
//               src={tenant.signature}
//               style={styles.signatureImage}
//             />
//           )}

//           <Text>
//             Authorized Signatory
//           </Text>

//         </View>

//         <View style={styles.footer}>

//           <Text>
//             Generated by RateFlow ERP
//           </Text>

//           <Text>
//             www.rateflow.in
//           </Text>

//         </View>

//       </Page>

//     </Document>
//   );
// }

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// ─── Number to Words ────────────────────────────────────────────────────────

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty",
  "Sixty", "Seventy", "Eighty", "Ninety",
];

const convertLessThanThousand = (amount: number): string => {
  let words = "";
  if (amount >= 100) {
    words += `${ones[Math.floor(amount / 100)]} Hundred`;
    amount %= 100;
    if (amount) words += " ";
  }
  if (amount >= 20) {
    words += tens[Math.floor(amount / 10)];
    amount %= 10;
    if (amount) words += ` ${ones[amount]}`;
  } else if (amount > 0) {
    words += ones[amount];
  }
  return words;
};

const convertNumberToWords = (amount: number): string => {
  if (amount === 0) return "Zero";
  const parts = [
    { value: 10000000, label: "Crore" },
    { value: 100000,   label: "Lakh" },
    { value: 1000,     label: "Thousand" },
    { value: 1,        label: "" },
  ];
  let remaining = amount;
  const words: string[] = [];
  for (const part of parts) {
    const count = Math.floor(remaining / part.value);
    if (count) {
      words.push(`${convertLessThanThousand(count)} ${part.label}`.trim());
      remaining %= part.value;
    }
  }
  return words.join(" ");
};

const convertAmountToWords = (amount: number): string => {
  const rupees = Math.floor(amount);
  const paise  = Math.round((amount - rupees) * 100);
  const rupeeWords = `${convertNumberToWords(rupees)} Rupees`;
  if (!paise) return `${rupeeWords} Only`;
  return `${rupeeWords} and ${convertNumberToWords(paise)} Paise Only`;
};

// ─── Colours ────────────────────────────────────────────────────────────────

const PRIMARY    = "#C0392B";
const PRIMARY_BG = "#FDECEA";
const BORDER     = "#C0392B";
const TEXT_DARK  = "#1A1A1A";
const TEXT_MID   = "#444444";
const TEXT_LIGHT = "#666666";
const WHITE      = "#FFFFFF";

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  page: {
    paddingHorizontal: 28,
    paddingVertical: 24,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: TEXT_DARK,
    backgroundColor: WHITE,
  },

  outerBorder: {
    border: 1,
    borderColor: BORDER,
    flex: 1,
  },

  titleBanner: {
    backgroundColor: PRIMARY,
    paddingVertical: 6,
    alignItems: "center",
  },

  titleText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },

  headerRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: BORDER,
  },

  companySection: {
    flex: 1,
    padding: 10,
    borderRight: 1,
    borderColor: BORDER,
    flexDirection: "row",
    gap: 8,
  },

  logo: {
    width: 60,
    height: 50,
    objectFit: "contain",
  },

  companyDetails: {
    flex: 1,
  },

  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
    marginBottom: 3,
  },

  companyMeta: {
    fontSize: 8,
    color: TEXT_MID,
    marginBottom: 2,
  },

  invoiceMetaSection: {
    width: 195,
    padding: 10,
  },

  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  metaLabel: {
    width: 80,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: TEXT_MID,
  },

  metaValue: {
    flex: 1,
    fontSize: 8,
    color: TEXT_DARK,
  },

  metaValueBold: {
    flex: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEXT_DARK,
  },

  billingSection: {
    borderBottom: 1,
    borderColor: BORDER,
  },

  billingSectionHeader: {
    backgroundColor: PRIMARY_BG,
    borderBottom: 1,
    borderColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  billingSectionHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: PRIMARY,
  },

  billingRow: {
    flexDirection: "row",
    padding: 10,
  },

  billingLeft: {
    flex: 1,
  },

  billingRight: {
    width: 195,
    borderLeft: 1,
    borderColor: BORDER,
    paddingLeft: 10,
  },

  billingField: {
    marginBottom: 3,
    flexDirection: "row",
  },

  billingLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: TEXT_MID,
    marginRight: 4,
    width: 60,
  },

  billingValue: {
    fontSize: 8,
    color: TEXT_DARK,
    flex: 1,
  },

  billingNameValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: TEXT_DARK,
    marginBottom: 5,
  },

  table: {
    borderBottom: 1,
    borderColor: BORDER,
  },

  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },

  tableHeaderCell: {
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottom: 1,
    borderColor: "#F0D0CE",
  },

  tableRowAlt: {
    backgroundColor: "#FEF6F5",
  },

  tableCell: {
    fontSize: 8,
    color: TEXT_DARK,
    textAlign: "center",
  },

  tableCellLeft: {
    fontSize: 8,
    color: TEXT_DARK,
    textAlign: "left",
  },

  colSr:      { width: 26 },
  colProduct: { flex: 2 },
  colQty:     { width: 36 },
  colRate:    { width: 52 },
  colTaxable: { width: 55 },
  colGST:     { width: 36 },
  colGSTAmt:  { width: 55 },
  colAmount:  { width: 60 },

  amountWordsBox: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: BORDER,
    padding: 8,
    backgroundColor: PRIMARY_BG,
  },

  amountWordsLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: PRIMARY,
    marginRight: 6,
  },

  amountWordsValue: {
    fontSize: 8,
    color: TEXT_DARK,
    flex: 1,
  },

  bottomSection: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: BORDER,
    minHeight: 90,
  },

  termsBox: {
    flex: 1,
    padding: 10,
    borderRight: 1,
    borderColor: BORDER,
  },

  termsHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: PRIMARY,
    marginBottom: 5,
  },

  termLine: {
    fontSize: 7.5,
    color: TEXT_MID,
    marginBottom: 2,
  },

  summaryBox: {
    width: 220,
    padding: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 8,
    color: TEXT_MID,
  },

  summaryValue: {
    fontSize: 8,
    color: TEXT_DARK,
    fontFamily: "Helvetica-Bold",
  },

  summaryDivider: {
    borderTop: 1,
    borderColor: BORDER,
    marginVertical: 4,
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: PRIMARY,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginTop: 2,
  },

  grandTotalLabel: {
    fontSize: 9,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
  },

  grandTotalValue: {
    fontSize: 9,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
  },

  signatureSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
  },

  signatureBlock: {
    alignItems: "center",
    borderTop: 1,
    borderColor: TEXT_MID,
    paddingTop: 6,
    minWidth: 140,
  },

  signatureImg: {
    width: 110,
    height: 50,
    objectFit: "contain",
    marginBottom: 4,
  },

  signatureLabel: {
    fontSize: 8,
    color: TEXT_MID,
    fontFamily: "Helvetica-Bold",
  },

  signatureCompany: {
    fontSize: 7.5,
    color: TEXT_LIGHT,
    marginTop: 2,
  },

  footer: {
    borderTop: 1,
    borderColor: BORDER,
    backgroundColor: PRIMARY_BG,
    paddingVertical: 4,
    alignItems: "center",
  },

  footerText: {
    fontSize: 7,
    color: TEXT_LIGHT,
  },
});

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  invoice: any;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InvoicePDF({ invoice }: Props) {

  const tenant: any =
    typeof invoice.tenantId === "object" && invoice.tenantId !== null
      ? invoice.tenantId
      : {};

  const customer: any = invoice.customerId || {};
  const items: any[]  = invoice.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price, 0
  );

  const gstTotal = items.reduce(
    (sum, item) =>
      sum + (item.quantity * item.price * (item.gstPercent || 0)) / 100,
    0
  );

  const grandTotal = subtotal + gstTotal;

  const amountInWords = convertAmountToWords(grandTotal);

  const invoiceDate = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

  const defaultTerms = [
    "Goods once sold will not be taken back.",
    `Subject to ${tenant?.city || "local"} jurisdiction.`,
    "Payment due within agreed credit period.",
    "Interest may apply on overdue balances.",
  ];

  const termLines: string[] = tenant?.terms
    ? tenant.terms.split("\n").filter(Boolean)
    : defaultTerms;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>

          {/* ── Title Banner ─────────────────────────────────── */}
          <View style={styles.titleBanner}>
            <Text style={styles.titleText}>TAX INVOICE</Text>
          </View>

          {/* ── Header: Company | Invoice Meta ───────────────── */}
          <View style={styles.headerRow}>

            <View style={styles.companySection}>
              {tenant?.logo && (
                <Image src={tenant.logo} style={styles.logo} />
              )}
              <View style={styles.companyDetails}>
                <Text style={styles.companyName}>
                  {tenant?.companyName || "—"}
                </Text>
                {tenant?.address && (
                  <Text style={styles.companyMeta}>{tenant.address}</Text>
                )}
                {tenant?.gstNumber && (
                  <Text style={styles.companyMeta}>GSTIN: {tenant.gstNumber}</Text>
                )}
                {tenant?.phone && (
                  <Text style={styles.companyMeta}>Phone: {tenant.phone}</Text>
                )}
                {tenant?.email && (
                  <Text style={styles.companyMeta}>Email: {tenant.email}</Text>
                )}
              </View>
            </View>

            <View style={styles.invoiceMetaSection}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice No.</Text>
                <Text style={styles.metaValueBold}>
                  {invoice.invoiceNumber || "—"}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{invoiceDate}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Vehicle No.</Text>
                <Text style={styles.metaValue}>
                  {invoice.vehicleNumber || "N/A"}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Payment Status</Text>
                <Text style={styles.metaValue}>
                  {invoice.paymentStatus || "Pending"}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Amount Due</Text>
                <Text style={styles.metaValueBold}>
                  Rs. {grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>

          </View>

          {/* ── Billing To ───────────────────────────────────── */}
          <View style={styles.billingSection}>
            <View style={styles.billingSectionHeader}>
              <Text style={styles.billingSectionHeaderText}>Billing To</Text>
            </View>
            <View style={styles.billingRow}>

              <View style={styles.billingLeft}>
                <Text style={styles.billingNameValue}>
                  {customer?.name || "—"}
                </Text>
                {customer?.address && (
                  <View style={styles.billingField}>
                    <Text style={styles.billingLabel}>Address:</Text>
                    <Text style={styles.billingValue}>{customer.address}</Text>
                  </View>
                )}
                {customer?.gstNumber && (
                  <View style={styles.billingField}>
                    <Text style={styles.billingLabel}>GSTIN:</Text>
                    <Text style={styles.billingValue}>{customer.gstNumber}</Text>
                  </View>
                )}
                {customer?.phone && (
                  <View style={styles.billingField}>
                    <Text style={styles.billingLabel}>Phone:</Text>
                    <Text style={styles.billingValue}>{customer.phone}</Text>
                  </View>
                )}
                {customer?.email && (
                  <View style={styles.billingField}>
                    <Text style={styles.billingLabel}>Email:</Text>
                    <Text style={styles.billingValue}>{customer.email}</Text>
                  </View>
                )}
              </View>

              <View style={styles.billingRight}>
                <View style={styles.billingField}>
                  <Text style={styles.billingLabel}>Invoice Date:</Text>
                  <Text style={styles.billingValue}>{invoiceDate}</Text>
                </View>
                <View style={styles.billingField}>
                  <Text style={styles.billingLabel}>Invoice No.:</Text>
                  <Text style={styles.billingValue}>
                    {invoice.invoiceNumber || "—"}
                  </Text>
                </View>
                {invoice.vehicleNumber && (
                  <View style={styles.billingField}>
                    <Text style={styles.billingLabel}>Vehicle No.:</Text>
                    <Text style={styles.billingValue}>
                      {invoice.vehicleNumber}
                    </Text>
                  </View>
                )}
              </View>

            </View>
          </View>

          {/* ── Items Table ──────────────────────────────────── */}
          <View style={styles.table}>

            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.colSr]}>Sr.</Text>
              <Text style={[styles.tableHeaderCell, styles.colProduct, { textAlign: "left" }]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.colTaxable]}>Taxable</Text>
              <Text style={[styles.tableHeaderCell, styles.colGST]}>GST%</Text>
              <Text style={[styles.tableHeaderCell, styles.colGSTAmt]}>GST Amt</Text>
              <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
            </View>

            {items.map((item: any, index: number) => {
              const taxable   = item.quantity * item.price;
              const gstAmt    = (taxable * (item.gstPercent || 0)) / 100;
              const lineTotal = taxable + gstAmt;
              return (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                >
                  <Text style={[styles.tableCell, styles.colSr]}>{index + 1}</Text>
                  <Text style={[styles.tableCellLeft, styles.colProduct]}>
                    {item.productId?.name || "—"}
                  </Text>
                  <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                  <Text style={[styles.tableCell, styles.colRate]}>Rs.{item.price}</Text>
                  <Text style={[styles.tableCell, styles.colTaxable]}>Rs.{taxable.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, styles.colGST]}>{item.gstPercent || 0}%</Text>
                  <Text style={[styles.tableCell, styles.colGSTAmt]}>Rs.{gstAmt.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, styles.colAmount]}>Rs.{lineTotal.toFixed(2)}</Text>
                </View>
              );
            })}

          </View>

          {/* ── Amount in Words ──────────────────────────────── */}
          <View style={styles.amountWordsBox}>
            <Text style={styles.amountWordsLabel}>Amount in Words:</Text>
            <Text style={styles.amountWordsValue}>{amountInWords}</Text>
          </View>

          {/* ── Bottom: Terms | Summary ──────────────────────── */}
          <View style={styles.bottomSection}>

            <View style={styles.termsBox}>
              <Text style={styles.termsHeader}>Terms & Conditions</Text>
              {termLines.map((line: string, i: number) => (
                <Text key={i} style={styles.termLine}>
                  {i + 1}. {line.replace(/^\d+\.\s*/, "")}
                </Text>
              ))}
            </View>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>Rs.{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST</Text>
                <Text style={styles.summaryValue}>Rs.{gstTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>Rs. {grandTotal.toFixed(2)}</Text>
              </View>
            </View>

          </View>

          {/* ── Signature ────────────────────────────────────── */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              {tenant?.signature && (
                <Image src={tenant.signature} style={styles.signatureImg} />
              )}
              <Text style={styles.signatureLabel}>Authorized Signatory</Text>
              {tenant?.companyName && (
                <Text style={styles.signatureCompany}>
                  For {tenant.companyName}
                </Text>
              )}
            </View>
          </View>

          {/* ── Footer ───────────────────────────────────────── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Generated by RateFlow ERP  •  www.rateflow.in
            </Text>
          </View>

        </View>
      </Page>
    </Document>
  );
}