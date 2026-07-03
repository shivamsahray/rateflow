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


//Used before for only A4 
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   Image,
//   StyleSheet,
// } from "@react-pdf/renderer";

// // ─── Number to Words ────────────────────────────────────────────────────────

// const ones = [
//   "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
//   "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
//   "Sixteen", "Seventeen", "Eighteen", "Nineteen",
// ];

// const tens = [
//   "", "", "Twenty", "Thirty", "Forty", "Fifty",
//   "Sixty", "Seventy", "Eighty", "Ninety",
// ];

// const convertLessThanThousand = (amount: number): string => {
//   let words = "";
//   if (amount >= 100) {
//     words += `${ones[Math.floor(amount / 100)]} Hundred`;
//     amount %= 100;
//     if (amount) words += " ";
//   }
//   if (amount >= 20) {
//     words += tens[Math.floor(amount / 10)];
//     amount %= 10;
//     if (amount) words += ` ${ones[amount]}`;
//   } else if (amount > 0) {
//     words += ones[amount];
//   }
//   return words;
// };

// const convertNumberToWords = (amount: number): string => {
//   if (amount === 0) return "Zero";
//   const parts = [
//     { value: 10000000, label: "Crore" },
//     { value: 100000,   label: "Lakh" },
//     { value: 1000,     label: "Thousand" },
//     { value: 1,        label: "" },
//   ];
//   let remaining = amount;
//   const words: string[] = [];
//   for (const part of parts) {
//     const count = Math.floor(remaining / part.value);
//     if (count) {
//       words.push(`${convertLessThanThousand(count)} ${part.label}`.trim());
//       remaining %= part.value;
//     }
//   }
//   return words.join(" ");
// };

// const convertAmountToWords = (amount: number): string => {
//   const rupees = Math.floor(amount);
//   const paise  = Math.round((amount - rupees) * 100);
//   const rupeeWords = `${convertNumberToWords(rupees)} Rupees`;
//   if (!paise) return `${rupeeWords} Only`;
//   return `${rupeeWords} and ${convertNumberToWords(paise)} Paise Only`;
// };

// // ─── Colours ────────────────────────────────────────────────────────────────

// const PRIMARY    = "#C0392B";
// const PRIMARY_BG = "#FDECEA";
// const BORDER     = "#C0392B";
// const TEXT_DARK  = "#1A1A1A";
// const TEXT_MID   = "#444444";
// const TEXT_LIGHT = "#666666";
// const WHITE      = "#FFFFFF";

// // ─── Styles ─────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({

//   page: {
//     paddingHorizontal: 28,
//     paddingVertical: 24,
//     fontSize: 9,
//     fontFamily: "Helvetica",
//     color: TEXT_DARK,
//     backgroundColor: WHITE,
//   },

//   outerBorder: {
//     border: 1,
//     borderColor: BORDER,
//     flex: 1,
//   },

//   titleBanner: {
//     backgroundColor: PRIMARY,
//     paddingVertical: 6,
//     alignItems: "center",
//   },

//   titleText: {
//     color: WHITE,
//     fontSize: 14,
//     fontFamily: "Helvetica-Bold",
//     letterSpacing: 2,
//   },

//   headerRow: {
//     flexDirection: "row",
//     borderBottom: 1,
//     borderColor: BORDER,
//   },

//   companySection: {
//     flex: 1,
//     padding: 10,
//     borderRight: 1,
//     borderColor: BORDER,
//     flexDirection: "row",
//     gap: 8,
//   },

//   logo: {
//     width: 60,
//     height: 50,
//     objectFit: "contain",
//   },

//   companyDetails: {
//     flex: 1,
//   },

//   companyName: {
//     fontSize: 14,
//     fontFamily: "Helvetica-Bold",
//     color: PRIMARY,
//     marginBottom: 3,
//   },

//   companyMeta: {
//     fontSize: 8,
//     color: TEXT_MID,
//     marginBottom: 2,
//   },

//   invoiceMetaSection: {
//     width: 195,
//     padding: 10,
//   },

//   metaRow: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },

//   metaLabel: {
//     width: 80,
//     fontFamily: "Helvetica-Bold",
//     fontSize: 8,
//     color: TEXT_MID,
//   },

//   metaValue: {
//     flex: 1,
//     fontSize: 8,
//     color: TEXT_DARK,
//   },

//   metaValueBold: {
//     flex: 1,
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     color: TEXT_DARK,
//   },

//   billingSection: {
//     borderBottom: 1,
//     borderColor: BORDER,
//   },

//   billingSectionHeader: {
//     backgroundColor: PRIMARY_BG,
//     borderBottom: 1,
//     borderColor: BORDER,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },

//   billingSectionHeaderText: {
//     fontFamily: "Helvetica-Bold",
//     fontSize: 9,
//     color: PRIMARY,
//   },

//   billingRow: {
//     flexDirection: "row",
//     padding: 10,
//   },

//   billingLeft: {
//     flex: 1,
//   },

//   billingRight: {
//     width: 195,
//     borderLeft: 1,
//     borderColor: BORDER,
//     paddingLeft: 10,
//   },

//   billingField: {
//     marginBottom: 3,
//     flexDirection: "row",
//   },

//   billingLabel: {
//     fontFamily: "Helvetica-Bold",
//     fontSize: 8,
//     color: TEXT_MID,
//     marginRight: 4,
//     width: 60,
//   },

//   billingValue: {
//     fontSize: 8,
//     color: TEXT_DARK,
//     flex: 1,
//   },

//   billingNameValue: {
//     fontSize: 10,
//     fontFamily: "Helvetica-Bold",
//     color: TEXT_DARK,
//     marginBottom: 5,
//   },

//   table: {
//     borderBottom: 1,
//     borderColor: BORDER,
//   },

//   tableHeaderRow: {
//     flexDirection: "row",
//     backgroundColor: PRIMARY,
//     paddingVertical: 5,
//     paddingHorizontal: 6,
//   },

//   tableHeaderCell: {
//     color: WHITE,
//     fontFamily: "Helvetica-Bold",
//     fontSize: 8,
//     textAlign: "center",
//   },

//   tableRow: {
//     flexDirection: "row",
//     paddingVertical: 5,
//     paddingHorizontal: 6,
//     borderBottom: 1,
//     borderColor: "#F0D0CE",
//   },

//   tableRowAlt: {
//     backgroundColor: "#FEF6F5",
//   },

//   tableCell: {
//     fontSize: 8,
//     color: TEXT_DARK,
//     textAlign: "center",
//   },

//   tableCellLeft: {
//     fontSize: 8,
//     color: TEXT_DARK,
//     textAlign: "left",
//   },

//   colSr:      { width: 26 },
//   colProduct: { flex: 2 },
//   colQty:     { width: 36 },
//   colRate:    { width: 52 },
//   colTaxable: { width: 55 },
//   colGST:     { width: 36 },
//   colGSTAmt:  { width: 55 },
//   colAmount:  { width: 60 },

//   amountWordsBox: {
//     flexDirection: "row",
//     borderBottom: 1,
//     borderColor: BORDER,
//     padding: 8,
//     backgroundColor: PRIMARY_BG,
//   },

//   amountWordsLabel: {
//     fontFamily: "Helvetica-Bold",
//     fontSize: 8,
//     color: PRIMARY,
//     marginRight: 6,
//   },

//   amountWordsValue: {
//     fontSize: 8,
//     color: TEXT_DARK,
//     flex: 1,
//   },

//   bottomSection: {
//     flexDirection: "row",
//     borderBottom: 1,
//     borderColor: BORDER,
//     minHeight: 90,
//   },

//   termsBox: {
//     flex: 1,
//     padding: 10,
//     borderRight: 1,
//     borderColor: BORDER,
//   },

//   termsHeader: {
//     fontFamily: "Helvetica-Bold",
//     fontSize: 8,
//     color: PRIMARY,
//     marginBottom: 5,
//   },

//   termLine: {
//     fontSize: 7.5,
//     color: TEXT_MID,
//     marginBottom: 2,
//   },

//   summaryBox: {
//     width: 220,
//     padding: 10,
//   },

//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },

//   summaryLabel: {
//     fontSize: 8,
//     color: TEXT_MID,
//   },

//   summaryValue: {
//     fontSize: 8,
//     color: TEXT_DARK,
//     fontFamily: "Helvetica-Bold",
//   },

//   summaryDivider: {
//     borderTop: 1,
//     borderColor: BORDER,
//     marginVertical: 4,
//   },

//   grandTotalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: PRIMARY,
//     paddingHorizontal: 6,
//     paddingVertical: 5,
//     marginTop: 2,
//   },

//   grandTotalLabel: {
//     fontSize: 9,
//     color: WHITE,
//     fontFamily: "Helvetica-Bold",
//   },

//   grandTotalValue: {
//     fontSize: 9,
//     color: WHITE,
//     fontFamily: "Helvetica-Bold",
//   },

//   signatureSection: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     padding: 12,
//   },

//   signatureBlock: {
//     alignItems: "center",
//     borderTop: 1,
//     borderColor: TEXT_MID,
//     paddingTop: 6,
//     minWidth: 140,
//   },

//   signatureImg: {
//     width: 110,
//     height: 50,
//     objectFit: "contain",
//     marginBottom: 4,
//   },

//   signatureLabel: {
//     fontSize: 8,
//     color: TEXT_MID,
//     fontFamily: "Helvetica-Bold",
//   },

//   signatureCompany: {
//     fontSize: 7.5,
//     color: TEXT_LIGHT,
//     marginTop: 2,
//   },

//   footer: {
//     borderTop: 1,
//     borderColor: BORDER,
//     backgroundColor: PRIMARY_BG,
//     paddingVertical: 4,
//     alignItems: "center",
//   },

//   footerText: {
//     fontSize: 7,
//     color: TEXT_LIGHT,
//   },
// });

// // ─── Props ───────────────────────────────────────────────────────────────────

// interface Props {
//   invoice: any;
// }

// // ─── Component ───────────────────────────────────────────────────────────────

// export default function InvoicePDF({ invoice }: Props) {

//   const tenant: any =
//     typeof invoice.tenantId === "object" && invoice.tenantId !== null
//       ? invoice.tenantId
//       : {};

//   const customer: any = invoice.customerId || {};
//   const items: any[]  = invoice.items || [];

//   const subtotal = items.reduce(
//     (sum, item) => sum + item.quantity * item.price, 0
//   );

//   const gstTotal = items.reduce(
//     (sum, item) =>
//       sum + (item.quantity * item.price * (item.gstPercent || 0)) / 100,
//     0
//   );

//   const grandTotal = subtotal + gstTotal;

//   const amountInWords = convertAmountToWords(grandTotal);

//   const invoiceDate = invoice.createdAt
//     ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
//         day: "2-digit", month: "short", year: "numeric",
//       })
//     : "—";

//   const defaultTerms = [
//     "Goods once sold will not be taken back.",
//     `Subject to ${tenant?.city || "local"} jurisdiction.`,
//     "Payment due within agreed credit period.",
//     "Interest may apply on overdue balances.",
//   ];

//   const termLines: string[] = tenant?.terms
//     ? tenant.terms.split("\n").filter(Boolean)
//     : defaultTerms;

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.outerBorder}>

//           {/* ── Title Banner ─────────────────────────────────── */}
//           <View style={styles.titleBanner}>
//             <Text style={styles.titleText}>TAX INVOICE</Text>
//           </View>

//           {/* ── Header: Company | Invoice Meta ───────────────── */}
//           <View style={styles.headerRow}>

//             <View style={styles.companySection}>
//               {tenant?.logo && (
//                 <Image src={tenant.logo} style={styles.logo} />
//               )}
//               <View style={styles.companyDetails}>
//                 <Text style={styles.companyName}>
//                   {tenant?.companyName || "—"}
//                 </Text>
//                 {tenant?.address && (
//                   <Text style={styles.companyMeta}>{tenant.address}</Text>
//                 )}
//                 {tenant?.gstNumber && (
//                   <Text style={styles.companyMeta}>GSTIN: {tenant.gstNumber}</Text>
//                 )}
//                 {tenant?.phone && (
//                   <Text style={styles.companyMeta}>Phone: {tenant.phone}</Text>
//                 )}
//                 {tenant?.email && (
//                   <Text style={styles.companyMeta}>Email: {tenant.email}</Text>
//                 )}
//               </View>
//             </View>

//             <View style={styles.invoiceMetaSection}>
//               <View style={styles.metaRow}>
//                 <Text style={styles.metaLabel}>Invoice No.</Text>
//                 <Text style={styles.metaValueBold}>
//                   {invoice.invoiceNumber || "—"}
//                 </Text>
//               </View>
//               <View style={styles.metaRow}>
//                 <Text style={styles.metaLabel}>Date</Text>
//                 <Text style={styles.metaValue}>{invoiceDate}</Text>
//               </View>
//               <View style={styles.metaRow}>
//                 <Text style={styles.metaLabel}>Vehicle No.</Text>
//                 <Text style={styles.metaValue}>
//                   {invoice.vehicleNumber || "N/A"}
//                 </Text>
//               </View>
//               <View style={styles.metaRow}>
//                 <Text style={styles.metaLabel}>EWay Bill No.</Text>
//                 <Text style={styles.metaValue}>
//                   {invoice.eWayBillNumber || "N/A"}
//                 </Text>
//               </View>
//               <View style={styles.metaRow}>
//                 <Text style={styles.metaLabel}>Amount Due</Text>
//                 <Text style={styles.metaValueBold}>
//                   Rs. {grandTotal.toFixed(2)}
//                 </Text>
//               </View>
//             </View>

//           </View>

//           {/* ── Billing To ───────────────────────────────────── */}
//           <View style={styles.billingSection}>
//             <View style={styles.billingSectionHeader}>
//               <Text style={styles.billingSectionHeaderText}>Billing To</Text>
//             </View>
//             <View style={styles.billingRow}>

//               <View style={styles.billingLeft}>
//                 <Text style={styles.billingNameValue}>
//                   {customer?.name || "—"}
//                 </Text>
//                 {customer?.address && (
//                   <View style={styles.billingField}>
//                     <Text style={styles.billingLabel}>Address:</Text>
//                     <Text style={styles.billingValue}>{customer.address}</Text>
//                   </View>
//                 )}
//                 {customer?.gstNumber && (
//                   <View style={styles.billingField}>
//                     <Text style={styles.billingLabel}>GSTIN:</Text>
//                     <Text style={styles.billingValue}>{customer.gstNumber}</Text>
//                   </View>
//                 )}
//                 {customer?.phone && (
//                   <View style={styles.billingField}>
//                     <Text style={styles.billingLabel}>Phone:</Text>
//                     <Text style={styles.billingValue}>{customer.phone}</Text>
//                   </View>
//                 )}
//                 {customer?.email && (
//                   <View style={styles.billingField}>
//                     <Text style={styles.billingLabel}>Email:</Text>
//                     <Text style={styles.billingValue}>{customer.email}</Text>
//                   </View>
//                 )}
//               </View>

//               <View style={styles.billingRight}>
//                 <View style={styles.billingField}>
//                   <Text style={styles.billingLabel}>Invoice Date:</Text>
//                   <Text style={styles.billingValue}>{invoiceDate}</Text>
//                 </View>
//                 <View style={styles.billingField}>
//                   <Text style={styles.billingLabel}>Invoice No.:</Text>
//                   <Text style={styles.billingValue}>
//                     {invoice.invoiceNumber || "—"}
//                   </Text>
//                 </View>
//                 {invoice.vehicleNumber && (
//                   <View style={styles.billingField}>
//                     <Text style={styles.billingLabel}>Vehicle No.:</Text>
//                     <Text style={styles.billingValue}>
//                       {invoice.vehicleNumber}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//               {/* </View>
//                 {invoice.ewayBillNumber && (
//                   <View style={styles.billingField}>
//                     <Text style={styles.billingLabel}>Vehicle No.:</Text>
//                     <Text style={styles.billingValue}>
//                       {invoice.eWayBillNumber}
//                     </Text>
//                   </View>
//                 )}
//               </View> */}

//             </View>
//           </View>

//           {/* ── Items Table ──────────────────────────────────── */}
//           <View style={styles.table}>

//             <View style={styles.tableHeaderRow}>
//               <Text style={[styles.tableHeaderCell, styles.colSr]}>Sr.</Text>
//               <Text style={[styles.tableHeaderCell, styles.colProduct, { textAlign: "left" }]}>
//                 Description
//               </Text>
//               <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
//               <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
//               <Text style={[styles.tableHeaderCell, styles.colTaxable]}>Taxable</Text>
//               <Text style={[styles.tableHeaderCell, styles.colGST]}>GST%</Text>
//               <Text style={[styles.tableHeaderCell, styles.colGSTAmt]}>GST Amt</Text>
//               <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
//             </View>

//             {items.map((item: any, index: number) => {
//               const taxable   = item.quantity * item.price;
//               const gstAmt    = (taxable * (item.gstPercent || 0)) / 100;
//               const lineTotal = taxable + gstAmt;
//               return (
//                 <View
//                   key={index}
//                   style={[
//                     styles.tableRow,
//                     index % 2 === 1 ? styles.tableRowAlt : {},
//                   ]}
//                 >
//                   <Text style={[styles.tableCell, styles.colSr]}>{index + 1}</Text>
//                   <Text style={[styles.tableCellLeft, styles.colProduct]}>
//                     {item.productId?.name || "—"}
//                   </Text>
//                   <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
//                   <Text style={[styles.tableCell, styles.colRate]}>Rs.{item.price}</Text>
//                   <Text style={[styles.tableCell, styles.colTaxable]}>Rs.{taxable.toFixed(2)}</Text>
//                   <Text style={[styles.tableCell, styles.colGST]}>{item.gstPercent || 0}%</Text>
//                   <Text style={[styles.tableCell, styles.colGSTAmt]}>Rs.{gstAmt.toFixed(2)}</Text>
//                   <Text style={[styles.tableCell, styles.colAmount]}>Rs.{lineTotal.toFixed(2)}</Text>
//                 </View>
//               );
//             })}

//           </View>

//           {/* ── Amount in Words ──────────────────────────────── */}
//           <View style={styles.amountWordsBox}>
//             <Text style={styles.amountWordsLabel}>Amount in Words:</Text>
//             <Text style={styles.amountWordsValue}>{amountInWords}</Text>
//           </View>

//           {/* ── Bottom: Terms | Summary ──────────────────────── */}
//           <View style={styles.bottomSection}>

//             <View style={styles.termsBox}>
//               <Text style={styles.termsHeader}>Terms & Conditions</Text>
//               {termLines.map((line: string, i: number) => (
//                 <Text key={i} style={styles.termLine}>
//                   {i + 1}. {line.replace(/^\d+\.\s*/, "")}
//                 </Text>
//               ))}
//             </View>

//             <View style={styles.summaryBox}>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Subtotal</Text>
//                 <Text style={styles.summaryValue}>Rs.{subtotal.toFixed(2)}</Text>
//               </View>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>GST</Text>
//                 <Text style={styles.summaryValue}>Rs.{gstTotal.toFixed(2)}</Text>
//               </View>
//               <View style={styles.summaryDivider} />
//               <View style={styles.grandTotalRow}>
//                 <Text style={styles.grandTotalLabel}>Grand Total</Text>
//                 <Text style={styles.grandTotalValue}>Rs. {grandTotal.toFixed(2)}</Text>
//               </View>
//             </View>

//           </View>

//           {/* ── Signature ────────────────────────────────────── */}
//           <View style={styles.signatureSection}>
//             <View style={styles.signatureBlock}>
//               {tenant?.signature && (
//                 <Image src={tenant.signature} style={styles.signatureImg} />
//               )}
//               <Text style={styles.signatureLabel}>Authorized Signatory</Text>
//               {tenant?.companyName && (
//                 <Text style={styles.signatureCompany}>
//                   For {tenant.companyName}
//                 </Text>
//               )}
//             </View>
//           </View>

//           {/* ── Footer ───────────────────────────────────────── */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               Generated by RateFlow ERP  •  www.rateflow.in
//             </Text>
//           </View>

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

// // ─── Number to Words ─────────────────────────────────────────────────────────

// const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
//   "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
//   "Eighteen","Nineteen"];
// const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

// const convertLessThanThousand = (amount: number): string => {
//   let words = "";
//   if (amount >= 100) {
//     words += `${ones[Math.floor(amount / 100)]} Hundred`;
//     amount %= 100;
//     if (amount) words += " ";
//   }
//   if (amount >= 20) {
//     words += tens[Math.floor(amount / 10)];
//     amount %= 10;
//     if (amount) words += ` ${ones[amount]}`;
//   } else if (amount > 0) {
//     words += ones[amount];
//   }
//   return words;
// };

// const convertNumberToWords = (amount: number): string => {
//   if (amount === 0) return "Zero";
//   const parts = [
//     { value: 10000000, label: "Crore" },
//     { value: 100000,   label: "Lakh" },
//     { value: 1000,     label: "Thousand" },
//     { value: 1,        label: "" },
//   ];
//   let remaining = amount;
//   const words: string[] = [];
//   for (const part of parts) {
//     const count = Math.floor(remaining / part.value);
//     if (count) {
//       words.push(`${convertLessThanThousand(count)} ${part.label}`.trim());
//       remaining %= part.value;
//     }
//   }
//   return words.join(" ");
// };

// const convertAmountToWords = (amount: number): string => {
//   const rupees = Math.floor(amount);
//   const paise  = Math.round((amount - rupees) * 100);
//   const rupeeWords = `${convertNumberToWords(rupees)} Rupees`;
//   if (!paise) return `${rupeeWords} Only`;
//   return `${rupeeWords} and ${convertNumberToWords(paise)} Paise Only`;
// };

// // ─── Colours ─────────────────────────────────────────────────────────────────

// const PRIMARY    = "#C0392B";
// const PRIMARY_BG = "#FDECEA";
// const BORDER     = "#C0392B";
// const TEXT_DARK  = "#1A1A1A";
// const TEXT_MID   = "#444444";
// const TEXT_LIGHT = "#666666";
// const WHITE      = "#FFFFFF";

// // ─── A4 Styles ───────────────────────────────────────────────────────────────

// const stylesA4 = StyleSheet.create({
//   page: {
//     paddingHorizontal: 28,
//     paddingVertical: 24,
//     fontSize: 9,
//     fontFamily: "Helvetica",
//     color: TEXT_DARK,
//     backgroundColor: WHITE,
//   },
//   outerBorder:            { border: 1, borderColor: BORDER, flex: 1 },
//   titleBanner:            { backgroundColor: PRIMARY, paddingVertical: 6, alignItems: "center" },
//   titleText:              { color: WHITE, fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: 2 },
//   headerRow:              { flexDirection: "row", borderBottom: 1, borderColor: BORDER },
//   companySection:         { flex: 1, padding: 10, borderRight: 1, borderColor: BORDER, flexDirection: "row", gap: 8 },
//   logo:                   { width: 60, height: 50, objectFit: "contain" },
//   companyDetails:         { flex: 1 },
//   companyName:            { fontSize: 14, fontFamily: "Helvetica-Bold", color: PRIMARY, marginBottom: 3 },
//   companyMeta:            { fontSize: 8, color: TEXT_MID, marginBottom: 2 },
//   invoiceMetaSection:     { width: 195, padding: 10 },
//   metaRow:                { flexDirection: "row", marginBottom: 4 },
//   metaLabel:              { width: 80, fontFamily: "Helvetica-Bold", fontSize: 8, color: TEXT_MID },
//   metaValue:              { flex: 1, fontSize: 8, color: TEXT_DARK },
//   metaValueBold:          { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: TEXT_DARK },
//   billingSection:         { borderBottom: 1, borderColor: BORDER },
//   billingSectionHeader:   { backgroundColor: PRIMARY_BG, borderBottom: 1, borderColor: BORDER, paddingHorizontal: 10, paddingVertical: 4 },
//   billingSectionHeaderText: { fontFamily: "Helvetica-Bold", fontSize: 9, color: PRIMARY },
//   billingRow:             { flexDirection: "row", padding: 10 },
//   billingLeft:            { flex: 1 },
//   billingRight:           { width: 195, borderLeft: 1, borderColor: BORDER, paddingLeft: 10 },
//   billingField:           { marginBottom: 3, flexDirection: "row" },
//   billingLabel:           { fontFamily: "Helvetica-Bold", fontSize: 8, color: TEXT_MID, marginRight: 4, width: 60 },
//   billingValue:           { fontSize: 8, color: TEXT_DARK, flex: 1 },
//   billingNameValue:       { fontSize: 10, fontFamily: "Helvetica-Bold", color: TEXT_DARK, marginBottom: 5 },
//   table:                  { borderBottom: 1, borderColor: BORDER },
//   tableHeaderRow:         { flexDirection: "row", backgroundColor: PRIMARY, paddingVertical: 5, paddingHorizontal: 6 },
//   tableHeaderCell:        { color: WHITE, fontFamily: "Helvetica-Bold", fontSize: 8, textAlign: "center" },
//   tableRow:               { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, borderBottom: 1, borderColor: "#F0D0CE" },
//   tableRowAlt:            { backgroundColor: "#FEF6F5" },
//   tableCell:              { fontSize: 8, color: TEXT_DARK, textAlign: "center" },
//   tableCellLeft:          { fontSize: 8, color: TEXT_DARK, textAlign: "left" },
//   colSr:                  { width: 26 },
//   colProduct:             { flex: 2 },
//   colQty:                 { width: 36 },
//   colRate:                { width: 52 },
//   colTaxable:             { width: 55 },
//   colGST:                 { width: 36 },
//   colGSTAmt:              { width: 55 },
//   colAmount:              { width: 60 },
//   amountWordsBox:         { flexDirection: "row", borderBottom: 1, borderColor: BORDER, padding: 8, backgroundColor: PRIMARY_BG },
//   amountWordsLabel:       { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, marginRight: 6 },
//   amountWordsValue:       { fontSize: 8, color: TEXT_DARK, flex: 1 },
//   bottomSection:          { flexDirection: "row", borderBottom: 1, borderColor: BORDER, minHeight: 90 },
//   termsBox:               { flex: 1, padding: 10, borderRight: 1, borderColor: BORDER },
//   termsHeader:            { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, marginBottom: 5 },
//   termLine:               { fontSize: 7.5, color: TEXT_MID, marginBottom: 2 },
//   summaryBox:             { width: 220, padding: 10 },
//   summaryRow:             { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
//   summaryLabel:           { fontSize: 8, color: TEXT_MID },
//   summaryValue:           { fontSize: 8, color: TEXT_DARK, fontFamily: "Helvetica-Bold" },
//   summaryDivider:         { borderTop: 1, borderColor: BORDER, marginVertical: 4 },
//   grandTotalRow:          { flexDirection: "row", justifyContent: "space-between", backgroundColor: PRIMARY, paddingHorizontal: 6, paddingVertical: 5, marginTop: 2 },
//   grandTotalLabel:        { fontSize: 9, color: WHITE, fontFamily: "Helvetica-Bold" },
//   grandTotalValue:        { fontSize: 9, color: WHITE, fontFamily: "Helvetica-Bold" },
//   signatureSection:       { flexDirection: "row", justifyContent: "flex-end", padding: 12 },
//   signatureBlock:         { alignItems: "center", borderTop: 1, borderColor: TEXT_MID, paddingTop: 6, minWidth: 140 },
//   signatureImg:           { width: 110, height: 50, objectFit: "contain", marginBottom: 4 },
//   signatureLabel:         { fontSize: 8, color: TEXT_MID, fontFamily: "Helvetica-Bold" },
//   signatureCompany:       { fontSize: 7.5, color: TEXT_LIGHT, marginTop: 2 },
//   footer:                 { borderTop: 1, borderColor: BORDER, backgroundColor: PRIMARY_BG, paddingVertical: 4, alignItems: "center" },
//   footerText:             { fontSize: 7, color: TEXT_LIGHT },
//   // A5 divider line (only used in A5 double layout)
//   a5Divider:              { borderBottom: 2, borderColor: BORDER, marginVertical: 0, borderStyle: "dashed" },
// });

// // ─── A5 Styles (scaled down for half page) ───────────────────────────────────

// const stylesA5 = StyleSheet.create({
//   page: {
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 7.5,
//     fontFamily: "Helvetica",
//     color: TEXT_DARK,
//     backgroundColor: WHITE,
//   },
//   outerBorder:            { border: 1, borderColor: BORDER, flex: 1 },
//   titleBanner:            { backgroundColor: PRIMARY, paddingVertical: 4, alignItems: "center" },
//   titleText:              { color: WHITE, fontSize: 10, fontFamily: "Helvetica-Bold", letterSpacing: 1.5 },
//   headerRow:              { flexDirection: "row", borderBottom: 1, borderColor: BORDER },
//   companySection:         { flex: 1, padding: 6, borderRight: 1, borderColor: BORDER, flexDirection: "row", gap: 5 },
//   logo:                   { width: 40, height: 34, objectFit: "contain" },
//   companyDetails:         { flex: 1 },
//   companyName:            { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: PRIMARY, marginBottom: 2 },
//   companyMeta:            { fontSize: 6.5, color: TEXT_MID, marginBottom: 1.5 },
//   invoiceMetaSection:     { width: 130, padding: 6 },
//   metaRow:                { flexDirection: "row", marginBottom: 3 },
//   metaLabel:              { width: 58, fontFamily: "Helvetica-Bold", fontSize: 6.5, color: TEXT_MID },
//   metaValue:              { flex: 1, fontSize: 6.5, color: TEXT_DARK },
//   metaValueBold:          { flex: 1, fontSize: 7, fontFamily: "Helvetica-Bold", color: TEXT_DARK },
//   billingSection:         { borderBottom: 1, borderColor: BORDER },
//   billingSectionHeader:   { backgroundColor: PRIMARY_BG, borderBottom: 1, borderColor: BORDER, paddingHorizontal: 6, paddingVertical: 3 },
//   billingSectionHeaderText: { fontFamily: "Helvetica-Bold", fontSize: 7, color: PRIMARY },
//   billingRow:             { flexDirection: "row", padding: 6 },
//   billingLeft:            { flex: 1 },
//   billingRight:           { width: 130, borderLeft: 1, borderColor: BORDER, paddingLeft: 6 },
//   billingField:           { marginBottom: 2, flexDirection: "row" },
//   billingLabel:           { fontFamily: "Helvetica-Bold", fontSize: 6.5, color: TEXT_MID, marginRight: 3, width: 45 },
//   billingValue:           { fontSize: 6.5, color: TEXT_DARK, flex: 1 },
//   billingNameValue:       { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: TEXT_DARK, marginBottom: 3 },
//   table:                  { borderBottom: 1, borderColor: BORDER },
//   tableHeaderRow:         { flexDirection: "row", backgroundColor: PRIMARY, paddingVertical: 3.5, paddingHorizontal: 4 },
//   tableHeaderCell:        { color: WHITE, fontFamily: "Helvetica-Bold", fontSize: 6.5, textAlign: "center" },
//   tableRow:               { flexDirection: "row", paddingVertical: 3.5, paddingHorizontal: 4, borderBottom: 1, borderColor: "#F0D0CE" },
//   tableRowAlt:            { backgroundColor: "#FEF6F5" },
//   tableCell:              { fontSize: 6.5, color: TEXT_DARK, textAlign: "center" },
//   tableCellLeft:          { fontSize: 6.5, color: TEXT_DARK, textAlign: "left" },
//   colSr:                  { width: 18 },
//   colProduct:             { flex: 2 },
//   colQty:                 { width: 26 },
//   colRate:                { width: 38 },
//   colTaxable:             { width: 40 },
//   colGST:                 { width: 26 },
//   colGSTAmt:              { width: 40 },
//   colAmount:              { width: 44 },
//   amountWordsBox:         { flexDirection: "row", borderBottom: 1, borderColor: BORDER, padding: 5, backgroundColor: PRIMARY_BG },
//   amountWordsLabel:       { fontFamily: "Helvetica-Bold", fontSize: 6.5, color: PRIMARY, marginRight: 4 },
//   amountWordsValue:       { fontSize: 6.5, color: TEXT_DARK, flex: 1 },
//   bottomSection:          { flexDirection: "row", borderBottom: 1, borderColor: BORDER, minHeight: 55 },
//   termsBox:               { flex: 1, padding: 6, borderRight: 1, borderColor: BORDER },
//   termsHeader:            { fontFamily: "Helvetica-Bold", fontSize: 6.5, color: PRIMARY, marginBottom: 3 },
//   termLine:               { fontSize: 6, color: TEXT_MID, marginBottom: 1.5 },
//   summaryBox:             { width: 150, padding: 6 },
//   summaryRow:             { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
//   summaryLabel:           { fontSize: 6.5, color: TEXT_MID },
//   summaryValue:           { fontSize: 6.5, color: TEXT_DARK, fontFamily: "Helvetica-Bold" },
//   summaryDivider:         { borderTop: 1, borderColor: BORDER, marginVertical: 3 },
//   grandTotalRow:          { flexDirection: "row", justifyContent: "space-between", backgroundColor: PRIMARY, paddingHorizontal: 5, paddingVertical: 4, marginTop: 1 },
//   grandTotalLabel:        { fontSize: 7.5, color: WHITE, fontFamily: "Helvetica-Bold" },
//   grandTotalValue:        { fontSize: 7.5, color: WHITE, fontFamily: "Helvetica-Bold" },
//   signatureSection:       { flexDirection: "row", justifyContent: "flex-end", padding: 8 },
//   signatureBlock:         { alignItems: "center", borderTop: 1, borderColor: TEXT_MID, paddingTop: 4, minWidth: 100 },
//   signatureImg:           { width: 80, height: 36, objectFit: "contain", marginBottom: 3 },
//   signatureLabel:         { fontSize: 6.5, color: TEXT_MID, fontFamily: "Helvetica-Bold" },
//   signatureCompany:       { fontSize: 6, color: TEXT_LIGHT, marginTop: 1.5 },
//   footer:                 { borderTop: 1, borderColor: BORDER, backgroundColor: PRIMARY_BG, paddingVertical: 3, alignItems: "center" },
//   footerText:             { fontSize: 6, color: TEXT_LIGHT },
//   a5Divider:              { borderBottom: 2, borderColor: BORDER, marginVertical: 0, borderStyle: "dashed" },
// });

// // ─── Shared InvoiceContent component ─────────────────────────────────────────
// // Used by both A4 and A5 so we don't duplicate JSX

// function InvoiceContent({
//   invoice,
//   s,
// }: {
//   invoice: any;
//   s: typeof stylesA4;
// }) {
//   const tenant: any =
//     typeof invoice.tenantId === "object" && invoice.tenantId !== null
//       ? invoice.tenantId
//       : {};

//   const customer: any = invoice.customerId || {};
//   const items: any[]  = invoice.items || [];

//   const subtotal = items.reduce(
//     (sum, item) => sum + item.quantity * item.price, 0
//   );
//   const gstTotal = items.reduce(
//     (sum, item) =>
//       sum + (item.quantity * item.price * (item.gstPercent || 0)) / 100,
//     0
//   );
//   const grandTotal = subtotal + gstTotal;
//   const amountInWords = convertAmountToWords(grandTotal);

//   const invoiceDate = invoice.createdAt
//     ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
//         day: "2-digit", month: "short", year: "numeric",
//       })
//     : "—";

//   const defaultTerms = [
//     "Goods once sold will not be taken back.",
//     `Subject to ${tenant?.city || "local"} jurisdiction.`,
//     "Payment due within agreed credit period.",
//     "Interest may apply on overdue balances.",
//   ];
//   const termLines: string[] = tenant?.terms
//     ? tenant.terms.split("\n").filter(Boolean)
//     : defaultTerms;

//   return (
//     <View style={s.outerBorder}>

//       {/* Title Banner */}
//       <View style={s.titleBanner}>
//         <Text style={s.titleText}>TAX INVOICE</Text>
//       </View>

//       {/* Header: Company | Invoice Meta */}
//       <View style={s.headerRow}>
//         <View style={s.companySection}>
//           {tenant?.logo && (
//             <Image src={tenant.logo} style={s.logo} />
//           )}
//           <View style={s.companyDetails}>
//             <Text style={s.companyName}>{tenant?.companyName || "—"}</Text>
//             {tenant?.address  && <Text style={s.companyMeta}>{tenant.address}</Text>}
//             {tenant?.gstNumber && <Text style={s.companyMeta}>GSTIN: {tenant.gstNumber}</Text>}
//             {tenant?.phone    && <Text style={s.companyMeta}>Phone: {tenant.phone}</Text>}
//             {tenant?.email    && <Text style={s.companyMeta}>Email: {tenant.email}</Text>}
//           </View>
//         </View>

//         <View style={s.invoiceMetaSection}>
//           <View style={s.metaRow}>
//             <Text style={s.metaLabel}>Invoice No.</Text>
//             <Text style={s.metaValueBold}>{invoice.invoiceNumber || "—"}</Text>
//           </View>
//           <View style={s.metaRow}>
//             <Text style={s.metaLabel}>Date</Text>
//             <Text style={s.metaValue}>{invoiceDate}</Text>
//           </View>
//           <View style={s.metaRow}>
//             <Text style={s.metaLabel}>Vehicle No.</Text>
//             <Text style={s.metaValue}>{invoice.vehicleNumber || "N/A"}</Text>
//           </View>
//           <View style={s.metaRow}>
//             <Text style={s.metaLabel}>EWay Bill No.</Text>
//             <Text style={s.metaValue}>{invoice.eWayBillNumber || "N/A"}</Text>
//           </View>
//           <View style={s.metaRow}>
//             <Text style={s.metaLabel}>Amount Due</Text>
//             <Text style={s.metaValueBold}>Rs. {grandTotal.toFixed(2)}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Billing To */}
//       <View style={s.billingSection}>
//         <View style={s.billingSectionHeader}>
//           <Text style={s.billingSectionHeaderText}>Billing To</Text>
//         </View>
//         <View style={s.billingRow}>
//           <View style={s.billingLeft}>
//             <Text style={s.billingNameValue}>{customer?.name || "—"}</Text>
//             {customer?.address && (
//               <View style={s.billingField}>
//                 <Text style={s.billingLabel}>Address:</Text>
//                 <Text style={s.billingValue}>{customer.address}</Text>
//               </View>
//             )}
//             {customer?.gstNumber && (
//               <View style={s.billingField}>
//                 <Text style={s.billingLabel}>GSTIN:</Text>
//                 <Text style={s.billingValue}>{customer.gstNumber}</Text>
//               </View>
//             )}
//             {customer?.phone && (
//               <View style={s.billingField}>
//                 <Text style={s.billingLabel}>Phone:</Text>
//                 <Text style={s.billingValue}>{customer.phone}</Text>
//               </View>
//             )}
//             {customer?.email && (
//               <View style={s.billingField}>
//                 <Text style={s.billingLabel}>Email:</Text>
//                 <Text style={s.billingValue}>{customer.email}</Text>
//               </View>
//             )}
//           </View>

//           <View style={s.billingRight}>
//             <View style={s.billingField}>
//               <Text style={s.billingLabel}>Invoice Date:</Text>
//               <Text style={s.billingValue}>{invoiceDate}</Text>
//             </View>
//             <View style={s.billingField}>
//               <Text style={s.billingLabel}>Invoice No.:</Text>
//               <Text style={s.billingValue}>{invoice.invoiceNumber || "—"}</Text>
//             </View>
//             {invoice.vehicleNumber && (
//               <View style={s.billingField}>
//                 <Text style={s.billingLabel}>Vehicle No.:</Text>
//                 <Text style={s.billingValue}>{invoice.vehicleNumber}</Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </View>

//       {/* Items Table */}
//       <View style={s.table}>
//         <View style={s.tableHeaderRow}>
//           <Text style={[s.tableHeaderCell, s.colSr]}>Sr.</Text>
//           <Text style={[s.tableHeaderCell, s.colProduct, { textAlign: "left" }]}>Description</Text>
//           <Text style={[s.tableHeaderCell, s.colQty]}>Qty</Text>
//           <Text style={[s.tableHeaderCell, s.colRate]}>Rate</Text>
//           <Text style={[s.tableHeaderCell, s.colTaxable]}>Taxable</Text>
//           <Text style={[s.tableHeaderCell, s.colGST]}>GST%</Text>
//           <Text style={[s.tableHeaderCell, s.colGSTAmt]}>GST Amt</Text>
//           <Text style={[s.tableHeaderCell, s.colAmount]}>Amount</Text>
//         </View>

//         {items.map((item: any, index: number) => {
//           const taxable   = item.quantity * item.price;
//           const gstAmt    = (taxable * (item.gstPercent || 0)) / 100;
//           const lineTotal = taxable + gstAmt;
//           return (
//             <View
//               key={index}
//               style={[s.tableRow, index % 2 === 1 ? s.tableRowAlt : {}]}
//             >
//               <Text style={[s.tableCell, s.colSr]}>{index + 1}</Text>
//               <Text style={[s.tableCellLeft, s.colProduct]}>
//                 {item.productId?.name || "—"}
//               </Text>
//               <Text style={[s.tableCell, s.colQty]}>{item.quantity}</Text>
//               <Text style={[s.tableCell, s.colRate]}>Rs.{item.price}</Text>
//               <Text style={[s.tableCell, s.colTaxable]}>Rs.{taxable.toFixed(2)}</Text>
//               <Text style={[s.tableCell, s.colGST]}>{item.gstPercent || 0}%</Text>
//               <Text style={[s.tableCell, s.colGSTAmt]}>Rs.{gstAmt.toFixed(2)}</Text>
//               <Text style={[s.tableCell, s.colAmount]}>Rs.{lineTotal.toFixed(2)}</Text>
//             </View>
//           );
//         })}
//       </View>

//       {/* Amount in Words */}
//       <View style={s.amountWordsBox}>
//         <Text style={s.amountWordsLabel}>Amount in Words:</Text>
//         <Text style={s.amountWordsValue}>{amountInWords}</Text>
//       </View>

//       {/* Bottom: Terms | Summary */}
//       <View style={s.bottomSection}>
//         <View style={s.termsBox}>
//           <Text style={s.termsHeader}>Terms & Conditions</Text>
//           {termLines.map((line: string, i: number) => (
//             <Text key={i} style={s.termLine}>
//               {i + 1}. {line.replace(/^\d+\.\s*/, "")}
//             </Text>
//           ))}
//         </View>
//         <View style={s.summaryBox}>
//           <View style={s.summaryRow}>
//             <Text style={s.summaryLabel}>Subtotal</Text>
//             <Text style={s.summaryValue}>Rs.{subtotal.toFixed(2)}</Text>
//           </View>
//           <View style={s.summaryRow}>
//             <Text style={s.summaryLabel}>GST</Text>
//             <Text style={s.summaryValue}>Rs.{gstTotal.toFixed(2)}</Text>
//           </View>
//           <View style={s.summaryDivider} />
//           <View style={s.grandTotalRow}>
//             <Text style={s.grandTotalLabel}>Grand Total</Text>
//             <Text style={s.grandTotalValue}>Rs. {grandTotal.toFixed(2)}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Signature */}
//       <View style={s.signatureSection}>
//         <View style={s.signatureBlock}>
//           {tenant?.signature && (
//             <Image src={tenant.signature} style={s.signatureImg} />
//           )}
//           <Text style={s.signatureLabel}>Authorized Signatory</Text>
//           {tenant?.companyName && (
//             <Text style={s.signatureCompany}>For {tenant.companyName}</Text>
//           )}
//         </View>
//       </View>

//       {/* Footer */}
//       <View style={s.footer}>
//         <Text style={s.footerText}>
//           Generated by RateFlow ERP  •  www.rateflow.in
//         </Text>
//       </View>

//     </View>
//   );
// }

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface Props {
//   invoice: any;
//   // "a4"        → single A4 page  (default)
//   // "a5-single" → single A5 page (half page used)
//   // "a5-double" → two copies on one A4 page, separated by dashed line
//   size?: "a4" | "a5-single" | "a5-double";
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function InvoicePDF({ invoice, size = "a4" }: Props) {

//   // A4: single full page
//   if (size === "a4") {
//     return (
//       <Document>
//         <Page size="A4" style={stylesA4.page}>
//           <InvoiceContent invoice={invoice} s={stylesA4} />
//         </Page>
//       </Document>
//     );
//   }

//   // A5 single: one copy, half page (A5 size page)
//   if (size === "a5-single") {
//     return (
//       <Document>
//         <Page size="A5" style={stylesA5.page}>
//           <InvoiceContent invoice={invoice} s={stylesA5} />
//         </Page>
//       </Document>
//     );
//   }

//   // A5 double: 2 copies on ONE A4 page — top half + dashed divider + bottom half
//   return (
//     <Document>
//       <Page size="A4" style={{ ...stylesA5.page, paddingHorizontal: 16, paddingVertical: 10 }}>

//         {/* Copy 1 — top half */}
//         <View style={{ flex: 1 }}>
//           <InvoiceContent invoice={invoice} s={stylesA5} />
//         </View>

//         {/* Dashed divider with "Cut Here" label */}
//         <View style={{
//           flexDirection: "row",
//           alignItems: "center",
//           marginVertical: 4,
//         }}>
//           <View style={{ flex: 1, borderBottom: 1.5, borderColor: "#999", borderStyle: "dashed" }} />
//           <Text style={{ fontSize: 7, color: "#999", marginHorizontal: 6 }}>✂  Cut Here</Text>
//           <View style={{ flex: 1, borderBottom: 1.5, borderColor: "#999", borderStyle: "dashed" }} />
//         </View>

//         {/* Copy 2 — bottom half */}
//         <View style={{ flex: 1 }}>
//           <InvoiceContent invoice={invoice} s={stylesA5} />
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
 
// ─── Number to Words ─────────────────────────────────────────────────────────
 
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
  "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
  "Eighteen","Nineteen"];
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
 
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
 
// ─── Colours ─────────────────────────────────────────────────────────────────
 
const PRIMARY    = "#C0392B";
const PRIMARY_BG = "#FDECEA";
const BORDER     = "#C0392B";
const TEXT_DARK  = "#1A1A1A";
const TEXT_MID   = "#444444";
const TEXT_LIGHT = "#666666";
const WHITE      = "#FFFFFF";
 
// ─── A4 Styles (unchanged) ───────────────────────────────────────────────────
 
const stylesA4 = StyleSheet.create({
  page: {
    paddingHorizontal: 28,
    paddingVertical: 24,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: TEXT_DARK,
    backgroundColor: WHITE,
  },
  outerBorder:            { border: 1, borderColor: BORDER, flex: 1 },
  titleBanner:            { backgroundColor: PRIMARY, paddingVertical: 6, alignItems: "center" },
  titleText:              { color: WHITE, fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: 2 },
  headerRow:              { flexDirection: "row", borderBottom: 1, borderColor: BORDER },
  companySection:         { flex: 1, padding: 10, borderRight: 1, borderColor: BORDER, flexDirection: "row", gap: 8 },
  logo:                   { width: 60, height: 50, objectFit: "contain" },
  companyDetails:         { flex: 1 },
  companyName:            { fontSize: 14, fontFamily: "Helvetica-Bold", color: PRIMARY, marginBottom: 3 },
  companyMeta:            { fontSize: 8, color: TEXT_MID, marginBottom: 2 },
  invoiceMetaSection:     { width: 195, padding: 10 },
  metaRow:                { flexDirection: "row", marginBottom: 4 },
  metaLabel:              { width: 80, fontFamily: "Helvetica-Bold", fontSize: 8, color: TEXT_MID },
  metaValue:              { flex: 1, fontSize: 8, color: TEXT_DARK },
  metaValueBold:          { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: TEXT_DARK },
  billingSection:         { borderBottom: 1, borderColor: BORDER },
  billingSectionHeader:   { backgroundColor: PRIMARY_BG, borderBottom: 1, borderColor: BORDER, paddingHorizontal: 10, paddingVertical: 4 },
  billingSectionHeaderText: { fontFamily: "Helvetica-Bold", fontSize: 9, color: PRIMARY },
  billingRow:             { flexDirection: "row", padding: 10 },
  billingLeft:            { flex: 1 },
  billingRight:           { width: 195, borderLeft: 1, borderColor: BORDER, paddingLeft: 10 },
  billingField:           { marginBottom: 3, flexDirection: "row" },
  billingLabel:           { fontFamily: "Helvetica-Bold", fontSize: 8, color: TEXT_MID, marginRight: 4, width: 60 },
  billingValue:           { fontSize: 8, color: TEXT_DARK, flex: 1 },
  billingNameValue:       { fontSize: 10, fontFamily: "Helvetica-Bold", color: TEXT_DARK, marginBottom: 5 },
  table:                  { borderBottom: 1, borderColor: BORDER },
  tableHeaderRow:         { flexDirection: "row", backgroundColor: PRIMARY, paddingVertical: 5, paddingHorizontal: 6 },
  tableHeaderCell:        { color: WHITE, fontFamily: "Helvetica-Bold", fontSize: 8, textAlign: "center" },
  tableRow:               { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, borderBottom: 1, borderColor: "#F0D0CE" },
  tableRowAlt:            { backgroundColor: "#FEF6F5" },
  tableCell:              { fontSize: 8, color: TEXT_DARK, textAlign: "center" },
  tableCellLeft:          { fontSize: 8, color: TEXT_DARK, textAlign: "left" },
  colSr:                  { width: 26 },
  colProduct:             { flex: 2 },
  colQty:                 { width: 36 },
  colRate:                { width: 52 },
  colTaxable:             { width: 55 },
  colGST:                 { width: 36 },
  colGSTAmt:              { width: 55 },
  colAmount:              { width: 60 },
  amountWordsBox:         { flexDirection: "row", borderBottom: 1, borderColor: BORDER, padding: 8, backgroundColor: PRIMARY_BG },
  amountWordsLabel:       { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, marginRight: 6 },
  amountWordsValue:       { fontSize: 8, color: TEXT_DARK, flex: 1 },
  bottomSection:          { flexDirection: "row", borderBottom: 1, borderColor: BORDER, minHeight: 90 },
  termsBox:               { flex: 1, padding: 10, borderRight: 1, borderColor: BORDER },
  termsHeader:            { fontFamily: "Helvetica-Bold", fontSize: 8, color: PRIMARY, marginBottom: 5 },
  termLine:               { fontSize: 7.5, color: TEXT_MID, marginBottom: 2 },
  summaryBox:             { width: 220, padding: 10 },
  summaryRow:             { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel:           { fontSize: 8, color: TEXT_MID },
  summaryValue:           { fontSize: 8, color: TEXT_DARK, fontFamily: "Helvetica-Bold" },
  summaryDivider:         { borderTop: 1, borderColor: BORDER, marginVertical: 4 },
  grandTotalRow:          { flexDirection: "row", justifyContent: "space-between", backgroundColor: PRIMARY, paddingHorizontal: 6, paddingVertical: 5, marginTop: 2 },
  grandTotalLabel:        { fontSize: 9, color: WHITE, fontFamily: "Helvetica-Bold" },
  grandTotalValue:        { fontSize: 9, color: WHITE, fontFamily: "Helvetica-Bold" },
  signatureSection:       { flexDirection: "row", justifyContent: "flex-end", padding: 12 },
  signatureBlock:         { alignItems: "center", borderTop: 1, borderColor: TEXT_MID, paddingTop: 6, minWidth: 140 },
  signatureImg:           { width: 110, height: 50, objectFit: "contain", marginBottom: 4 },
  signatureLabel:         { fontSize: 8, color: TEXT_MID, fontFamily: "Helvetica-Bold" },
  signatureCompany:       { fontSize: 7.5, color: TEXT_LIGHT, marginTop: 2 },
  footer:                 { borderTop: 1, borderColor: BORDER, backgroundColor: PRIMARY_BG, paddingVertical: 4, alignItems: "center" },
  footerText:             { fontSize: 7, color: TEXT_LIGHT },
  a5Divider:              { borderBottom: 2, borderColor: BORDER, marginVertical: 0, borderStyle: "dashed" },
});
 
// ─── A5 Compact Styles ────────────────────────────────────────────────────────
// Sample photo jaisa: no logo area, no address blocks, no terms, no footer
// Only: company name + invoice meta | bill to (1 line) | table | totals | sign line
 
const sA5 = StyleSheet.create({
  page: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 7,
    fontFamily: "Helvetica",
    color: TEXT_DARK,
    backgroundColor: WHITE,
  },
 
  // ── Outer border ──
  outerBorder: { border: 1, borderColor: BORDER },
 
  // ── Title strip ──
  titleBanner: { backgroundColor: PRIMARY, paddingVertical: 3, alignItems: "center" },
  titleText:   { color: WHITE, fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1.5 },
 
  // ── Header: company (left) | invoice meta (right) ──
  headerRow:          { flexDirection: "row", borderBottom: 1, borderColor: BORDER },
  companySection:     { flex: 1, padding: 5, borderRight: 1, borderColor: BORDER },
  companyName:        { fontSize: 12, fontFamily: "Helvetica-Bold", color: PRIMARY, marginBottom: 2 },
  companyMeta:        { fontSize: 6, color: TEXT_MID, marginBottom: 1 },
  invoiceMetaSection: { width: 110, padding: 5 },
  metaRow:            { flexDirection: "row", marginBottom: 2 },
  metaLabel:          { width: 52, fontFamily: "Helvetica-Bold", fontSize: 6, color: TEXT_MID },
  metaValue:          { flex: 1, fontSize: 6, color: TEXT_DARK },
  metaValueBold:      { flex: 1, fontSize: 7, fontFamily: "Helvetica-Bold", color: TEXT_DARK },
 
  // ── Bill To — compact single row strip ──
  billRow:        { flexDirection: "row", borderBottom: 1, borderColor: BORDER, padding: 4, alignItems: "center" },
  billLabel:      { fontFamily: "Helvetica-Bold", fontSize: 6, color: PRIMARY, marginRight: 5, width: 30 },
  billName:       { fontFamily: "Helvetica-Bold", fontSize: 10, color: TEXT_DARK, marginRight: 8 },
  billMeta:       { fontSize: 6, color: TEXT_MID, marginRight: 6 },
 
  // ── Items Table ──
  table:           { borderBottom: 1, borderColor: BORDER },
  tableHeaderRow:  { flexDirection: "row", backgroundColor: PRIMARY, paddingVertical: 3, paddingHorizontal: 4 },
  tableHeaderCell: { color: WHITE, fontFamily: "Helvetica-Bold", fontSize: 6, textAlign: "center" },
  tableRow:        { flexDirection: "row", paddingVertical: 2.5, paddingHorizontal: 4, borderBottom: 1, borderColor: "#F0D0CE" },
  tableRowAlt:     { backgroundColor: "#FEF6F5" },
  tableCell:       { fontSize: 8, color: TEXT_DARK, textAlign: "center" },
  tableCellLeft:   { fontSize: 8, color: TEXT_DARK, textAlign: "left" },
 
  // Column widths — optimised for A5 width (~420pt)
  colSr:      { width: 16 },
  colProduct: { flex: 2 },
  colQty:     { width: 22 },
  colUnit:    { width: 22 },
  colRate:    { width: 32 },
  colGST:     { width: 22 },
  colGSTAmt:  { width: 38 },
  colAmount:  { width: 42 },
 
  // ── Totals row ──
  totalsSection:  { flexDirection: "row", justifyContent: "flex-end", borderBottom: 1, borderColor: BORDER },
  totalsBox:      { width: 160, padding: 5 },
  totalRow:       { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  totalLabel:     { fontSize: 6.5, color: TEXT_MID },
  totalValue:     { fontSize: 6.5, color: TEXT_DARK, fontFamily: "Helvetica-Bold" },
  totalDivider:   { borderTop: 1, borderColor: BORDER, marginVertical: 2 },
  grandTotalRow:  { flexDirection: "row", justifyContent: "space-between", backgroundColor: PRIMARY, paddingHorizontal: 5, paddingVertical: 3 },
  grandTotalLabel:{ fontSize: 7, color: WHITE, fontFamily: "Helvetica-Bold" },
  grandTotalValue:{ fontSize: 7, color: WHITE, fontFamily: "Helvetica-Bold" },
 
  // ── Signature strip — just text, no image ──
  signRow:        { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", padding: 5 },
  amtWords:       { flex: 1, fontSize: 5.5, color: TEXT_MID, paddingRight: 8 },
  amtWordsLabel:  { fontFamily: "Helvetica-Bold", color: PRIMARY },
  signBlock:      { alignItems: "center", borderTop: 1, borderColor: TEXT_MID, paddingTop: 3, minWidth: 80 },
  signLabel:      { fontSize: 6, color: TEXT_MID, fontFamily: "Helvetica-Bold" },
});
 
// ─── A4 Full Invoice Content (unchanged) ─────────────────────────────────────
 
function InvoiceContentA4({ invoice }: { invoice: any }) {
  const tenant: any =
    typeof invoice.tenantId === "object" && invoice.tenantId !== null
      ? invoice.tenantId : {};
  const customer: any = invoice.customerId || {};
  const items: any[]  = invoice.items || [];
 
  const subtotal   = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const gstTotal   = items.reduce((s, i) => s + (i.quantity * i.price * (i.gstPercent || 0)) / 100, 0);
  const grandTotal = subtotal + gstTotal;
  const amountInWords = convertAmountToWords(grandTotal);
 
  const invoiceDate = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
 
  const defaultTerms = [
    "Goods once sold will not be taken back.",
    `Subject to ${tenant?.city || "local"} jurisdiction.`,
    "Payment due within agreed credit period.",
    "Interest may apply on overdue balances.",
  ];
  // ✅ FIX: tenant.defaultTerms (Settings se) use karo, fallback defaultTerms
  const termLines: string[] = tenant?.defaultTerms
    ? tenant.defaultTerms.split("\n").filter(Boolean) : defaultTerms;

  // ✅ NEW: Is specific invoice ka apna note (CreateInvoice ke "Notes" field se)
  const invoiceNote: string = invoice.notes?.trim() || "";
 
  const s = stylesA4;
 
  return (
    <View style={s.outerBorder}>
      <View style={s.titleBanner}>
        <Text style={s.titleText}>TAX INVOICE</Text>
      </View>
 
      <View style={s.headerRow}>
        <View style={s.companySection}>
          {tenant?.logo && <Image src={tenant.logo} style={s.logo} />}
          <View style={s.companyDetails}>
            <Text style={s.companyName}>{tenant?.companyName || "—"}</Text>
            {tenant?.address   && <Text style={s.companyMeta}>{tenant.address}</Text>}
            {tenant?.gstNumber && <Text style={s.companyMeta}>GSTIN: {tenant.gstNumber}</Text>}
            {tenant?.phone     && <Text style={s.companyMeta}>Phone: {tenant.phone}</Text>}
            {tenant?.email     && <Text style={s.companyMeta}>Email: {tenant.email}</Text>}
          </View>
        </View>
        <View style={s.invoiceMetaSection}>
          <View style={s.metaRow}><Text style={s.metaLabel}>Invoice No.</Text><Text style={s.metaValueBold}>{invoice.invoiceNumber || "—"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaLabel}>Date</Text><Text style={s.metaValue}>{invoiceDate}</Text></View>
          <View style={s.metaRow}><Text style={s.metaLabel}>Vehicle No.</Text><Text style={s.metaValue}>{invoice.vehicleNumber || "N/A"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaLabel}>EWay Bill No.</Text><Text style={s.metaValue}>{invoice.eWayBillNumber || "N/A"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaLabel}>Amount Due</Text><Text style={s.metaValueBold}>Rs. {grandTotal.toFixed(2)}</Text></View>
        </View>
      </View>
 
      <View style={s.billingSection}>
        <View style={s.billingSectionHeader}>
          <Text style={s.billingSectionHeaderText}>Billing To</Text>
        </View>
        <View style={s.billingRow}>
          <View style={s.billingLeft}>
            <Text style={s.billingNameValue}>{customer?.name || "—"}</Text>
            {customer?.address && <View style={s.billingField}><Text style={s.billingLabel}>Address:</Text><Text style={s.billingValue}>{customer.address}</Text></View>}
            {customer?.gstNumber && <View style={s.billingField}><Text style={s.billingLabel}>GSTIN:</Text><Text style={s.billingValue}>{customer.gstNumber}</Text></View>}
            {customer?.phone && <View style={s.billingField}><Text style={s.billingLabel}>Phone:</Text><Text style={s.billingValue}>{customer.phone}</Text></View>}
          </View>
          <View style={s.billingRight}>
            <View style={s.billingField}><Text style={s.billingLabel}>Invoice Date:</Text><Text style={s.billingValue}>{invoiceDate}</Text></View>
            <View style={s.billingField}><Text style={s.billingLabel}>Invoice No.:</Text><Text style={s.billingValue}>{invoice.invoiceNumber || "—"}</Text></View>
            {invoice.vehicleNumber && <View style={s.billingField}><Text style={s.billingLabel}>Vehicle No.:</Text><Text style={s.billingValue}>{invoice.vehicleNumber}</Text></View>}
          </View>
        </View>
      </View>
 
      <View style={s.table}>
        <View style={s.tableHeaderRow}>
          <Text style={[s.tableHeaderCell, s.colSr]}>Sr.</Text>
          <Text style={[s.tableHeaderCell, s.colProduct, { textAlign: "left" }]}>Description</Text>
          <Text style={[s.tableHeaderCell, s.colQty]}>Qty</Text>
          <Text style={[s.tableHeaderCell, s.colRate]}>Rate</Text>
          <Text style={[s.tableHeaderCell, s.colTaxable]}>Taxable</Text>
          <Text style={[s.tableHeaderCell, s.colGST]}>GST%</Text>
          <Text style={[s.tableHeaderCell, s.colGSTAmt]}>GST Amt</Text>
          <Text style={[s.tableHeaderCell, s.colAmount]}>Amount</Text>
        </View>
        {items.map((item: any, idx: number) => {
          const taxable = item.quantity * item.price;
          const gstAmt  = (taxable * (item.gstPercent || 0)) / 100;
          return (
            <View key={idx} style={[s.tableRow, idx % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={[s.tableCell, s.colSr]}>{idx + 1}</Text>
              <Text style={[s.tableCellLeft, s.colProduct]}>{item.productId?.name || "—"}</Text>
              <Text style={[s.tableCell, s.colQty]}>{item.quantity}</Text>
              <Text style={[s.tableCell, s.colRate]}>Rs.{item.price}</Text>
              <Text style={[s.tableCell, s.colTaxable]}>Rs.{taxable.toFixed(2)}</Text>
              <Text style={[s.tableCell, s.colGST]}>{item.gstPercent || 0}%</Text>
              <Text style={[s.tableCell, s.colGSTAmt]}>Rs.{gstAmt.toFixed(2)}</Text>
              <Text style={[s.tableCell, s.colAmount]}>Rs.{(taxable + gstAmt).toFixed(2)}</Text>
            </View>
          );
        })}
      </View>
 
      <View style={s.amountWordsBox}>
        <Text style={s.amountWordsLabel}>Amount in Words:</Text>
        <Text style={s.amountWordsValue}>{amountInWords}</Text>
      </View>
 
      <View style={s.bottomSection}>
        <View style={s.termsBox}>
          <Text style={s.termsHeader}>Terms & Conditions</Text>
          {termLines.map((line: string, i: number) => (
            <Text key={i} style={s.termLine}>{i + 1}. {line.replace(/^\d+\.\s*/, "")}</Text>
          ))}

          {/* ✅ NEW: Invoice-specific note, alag se dikhega agar present hai */}
          {invoiceNote && (
            <>
              <Text style={[s.termsHeader, { marginTop: 6 }]}>Note</Text>
              <Text style={s.termLine}>{invoiceNote}</Text>
            </>
          )}
        </View>
        <View style={s.summaryBox}>
          <View style={s.summaryRow}><Text style={s.summaryLabel}>Subtotal</Text><Text style={s.summaryValue}>Rs.{subtotal.toFixed(2)}</Text></View>
          <View style={s.summaryRow}><Text style={s.summaryLabel}>GST</Text><Text style={s.summaryValue}>Rs.{gstTotal.toFixed(2)}</Text></View>
          <View style={s.summaryDivider} />
          <View style={s.grandTotalRow}><Text style={s.grandTotalLabel}>Grand Total</Text><Text style={s.grandTotalValue}>Rs. {grandTotal.toFixed(2)}</Text></View>
        </View>
      </View>
 
      <View style={s.signatureSection}>
        <View style={s.signatureBlock}>
          {tenant?.signature && <Image src={tenant.signature} style={s.signatureImg} />}
          <Text style={s.signatureLabel}>Authorized Signatory</Text>
          {tenant?.companyName && <Text style={s.signatureCompany}>For {tenant.companyName}</Text>}
        </View>
      </View>
 
      <View style={s.footer}>
        <Text style={s.footerText}>Generated by RateFlow ERP  •  www.rateflow.in</Text>
      </View>
    </View>
  );
}
 
// ─── A5 Compact Invoice Content ───────────────────────────────────────────────
// Sample photo format:
// - TAX INVOICE strip
// - Company name + GST + phone  |  Invoice No / Date / Vehicle
// - Bill To: Name  GST  Phone   (single compact row)
// - Table: Sr | Description | Qty | Unit | Rate | GST% | GST Amt | Amount
// - Totals box (right aligned)
// - Bottom: Amount in words (left) | Authorised Signatory (right, text only)
// NO: address blocks, billing right column, terms, footer, logo
 
function InvoiceContentA5({ invoice }: { invoice: any }) {
  const tenant: any =
    typeof invoice.tenantId === "object" && invoice.tenantId !== null
      ? invoice.tenantId : {};
  const customer: any = invoice.customerId || {};
  const items: any[]  = invoice.items || [];
 
  const subtotal   = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const gstTotal   = items.reduce((s, i) => s + (i.quantity * i.price * (i.gstPercent || 0)) / 100, 0);
  const grandTotal = subtotal + gstTotal;
  const amountInWords = convertAmountToWords(grandTotal);
 
  const invoiceDate = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  // ✅ NEW: Invoice-specific note (agar present hai)
  const invoiceNote: string = invoice.notes?.trim() || "";
 
  return (
    <View style={sA5.outerBorder}>
 
      {/* ── Title Banner ── */}
      <View style={sA5.titleBanner}>
        <Text style={sA5.titleText}>TAX INVOICE</Text>
      </View>
 
      {/* ── Header: Company | Invoice Meta ── */}
      <View style={sA5.headerRow}>
        <View style={sA5.companySection}>
          <Text style={sA5.companyName}>{tenant?.companyName || "—"}</Text>
          {tenant?.gstNumber && <Text style={sA5.companyMeta}>GSTIN: {tenant.gstNumber}</Text>}
          {tenant?.phone     && <Text style={sA5.companyMeta}>Phone: {tenant.phone}</Text>}
          {tenant?.email     && <Text style={sA5.companyMeta}>Email: {tenant.email}</Text>}
        </View>
 
        <View style={sA5.invoiceMetaSection}>
          <View style={sA5.metaRow}>
            <Text style={sA5.metaLabel}>Invoice No.</Text>
            <Text style={sA5.metaValueBold}>{invoice.invoiceNumber || "—"}</Text>
          </View>
          <View style={sA5.metaRow}>
            <Text style={sA5.metaLabel}>Date</Text>
            <Text style={sA5.metaValue}>{invoiceDate}</Text>
          </View>
          {invoice.vehicleNumber && (
            <View style={sA5.metaRow}>
              <Text style={sA5.metaLabel}>Vehicle No.</Text>
              <Text style={sA5.metaValue}>{invoice.vehicleNumber}</Text>
            </View>
          )}
          <View style={sA5.metaRow}>
            <Text style={sA5.metaLabel}>Amount Due</Text>
            <Text style={sA5.metaValueBold}>Rs.{grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>
 
      {/* ── Bill To — compact single strip ── */}
      <View style={sA5.billRow}>
        <Text style={sA5.billLabel}>Billed To :</Text>
        <Text style={sA5.billName}>{customer?.name || "—"}</Text>
        {customer?.gstNumber && <Text style={sA5.billMeta}>GST: {customer.gstNumber}</Text>}
        {customer?.phone     && <Text style={sA5.billMeta}>Ph: {customer.phone}</Text>}
        {customer?.address   && <Text style={[sA5.billMeta, { flex: 1 }]}>{customer.address}</Text>}
      </View>
 
      {/* ── Items Table ── */}
      <View style={sA5.table}>
        <View style={sA5.tableHeaderRow}>
          <Text style={[sA5.tableHeaderCell, sA5.colSr]}>S.N.</Text>
          <Text style={[sA5.tableHeaderCell, sA5.colProduct, { textAlign: "left" }]}>Goods / Services</Text>
          <Text style={[sA5.tableHeaderCell, sA5.colQty]}>Qty.</Text>
          <Text style={[sA5.tableHeaderCell, sA5.colUnit]}>Unit</Text>
          <Text style={[sA5.tableHeaderCell, sA5.colRate]}>List Price</Text>
          <Text style={[sA5.tableHeaderCell, sA5.colGST]}>GST%</Text>
          <Text style={[sA5.tableHeaderCell, sA5.colGSTAmt]}>GST Amt.</Text>
          <Text style={[sA5.tableHeaderCell, sA5.colAmount]}>Amount</Text>
        </View>
 
        {/* Actual item rows */}
        {items.map((item: any, idx: number) => {
          const taxable = item.quantity * item.price;
          const gstAmt  = (taxable * (item.gstPercent || 0)) / 100;
          return (
            <View key={"item-" + idx} style={[sA5.tableRow, idx % 2 === 1 ? sA5.tableRowAlt : {}]}>
              <Text style={[sA5.tableCell, sA5.colSr]}>{idx + 1}</Text>
              <Text style={[sA5.tableCellLeft, sA5.colProduct]}>{item.productId?.name || "—"}</Text>
              <Text style={[sA5.tableCell, sA5.colQty]}>{item.quantity}</Text>
              <Text style={[sA5.tableCell, sA5.colUnit]}>{item.productId?.unit || "Pcs."}</Text>
              <Text style={[sA5.tableCell, sA5.colRate]}>Rs.{item.price}</Text>
              <Text style={[sA5.tableCell, sA5.colGST]}>{item.gstPercent || 0}%</Text>
              <Text style={[sA5.tableCell, sA5.colGSTAmt]}>Rs.{gstAmt.toFixed(2)}</Text>
              <Text style={[sA5.tableCell, sA5.colAmount]}>Rs.{(taxable + gstAmt).toFixed(2)}</Text>
            </View>
          );
        })}
 
        {/* Empty rows: minimum 10 rows hamesha, 10 se zyada items pe badhti rahengi */}
        {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, idx) => (
          <View key={"empty-" + idx} style={[sA5.tableRow, (items.length + idx) % 2 === 1 ? sA5.tableRowAlt : {}]}>
            <Text style={[sA5.tableCell, sA5.colSr]}> </Text>
            <Text style={[sA5.tableCellLeft, sA5.colProduct]}> </Text>
            <Text style={[sA5.tableCell, sA5.colQty]}> </Text>
            <Text style={[sA5.tableCell, sA5.colUnit]}> </Text>
            <Text style={[sA5.tableCell, sA5.colRate]}> </Text>
            <Text style={[sA5.tableCell, sA5.colGST]}> </Text>
            <Text style={[sA5.tableCell, sA5.colGSTAmt]}> </Text>
            <Text style={[sA5.tableCell, sA5.colAmount]}> </Text>
          </View>
        ))}
      </View>
 
      {/* ── Totals ── */}
      <View style={sA5.totalsSection}>
        <View style={sA5.totalsBox}>
          <View style={sA5.totalRow}>
            <Text style={sA5.totalLabel}>Subtotal</Text>
            <Text style={sA5.totalValue}>Rs.{subtotal.toFixed(2)}</Text>
          </View>
          <View style={sA5.totalRow}>
            <Text style={sA5.totalLabel}>GST</Text>
            <Text style={sA5.totalValue}>Rs.{gstTotal.toFixed(2)}</Text>
          </View>
          <View style={sA5.totalDivider} />
          <View style={sA5.grandTotalRow}>
            <Text style={sA5.grandTotalLabel}>Grand Total</Text>
            <Text style={sA5.grandTotalValue}>Rs. {grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>
 
      {/* ✅ NEW: Invoice-specific note */}
      {invoiceNote && (
        <View style={{ paddingHorizontal: 5, paddingTop: 3 }}>
          <Text style={{ fontSize: 5.5, color: TEXT_MID }}>
            <Text style={{ fontFamily: "Helvetica-Bold", color: PRIMARY }}>Note:  </Text>
            {invoiceNote}
          </Text>
        </View>
      )}

      {/* ── Bottom: Amount in Words | Sign ── */}
      <View style={sA5.signRow}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={sA5.amtWords}>
            <Text style={sA5.amtWordsLabel}>Amount in Words:  </Text>
            {amountInWords}
          </Text>
        </View>
        <View style={sA5.signBlock}>
          <Text style={sA5.signLabel}>Authorised Signatory</Text>
        </View>
      </View>
 
    </View>
  );
}
 
// ─── Props ────────────────────────────────────────────────────────────────────
 
interface Props {
  invoice: any;
  size?: "a4" | "a5-single" | "a5-double";
}
 
// ─── Main Export ─────────────────────────────────────────────────────────────
 
export default function InvoicePDF({ invoice, size = "a4" }: Props) {
 
  // A4 — full page, all details (unchanged)
  if (size === "a4") {
    return (
      <Document>
        <Page size="A4" style={stylesA4.page} wrap>
          <InvoiceContentA4 invoice={invoice} />
        </Page>
      </Document>
    );
  }
 
  // A5 single — compact format, true A5 page size
  if (size === "a5-single") {
    return (
      <Document>
        <Page size="A5" style={sA5.page} wrap>
          <InvoiceContentA5 invoice={invoice} />
        </Page>
      </Document>
    );
  }
 
  // A5 double — 2 copies on 1 A4 page, dashed cut line in middle
  return (
    <Document>
      <Page size="A4" style={{ ...sA5.page, paddingHorizontal: 12, paddingVertical: 8 }}>
 
        {/* Copy 1 — top half */}
        <View style={{ flex: 1 }}>
          <InvoiceContentA5 invoice={invoice} />
        </View>
 
        {/* ✂ Cut Here divider */}
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 3 }}>
          <View style={{ flex: 1, borderBottom: 1, borderColor: "#AAAAAA", borderStyle: "dashed" }} />
          <Text style={{ fontSize: 6.5, color: "#AAAAAA", marginHorizontal: 5 }}>✂  Cut Here</Text>
          <View style={{ flex: 1, borderBottom: 1, borderColor: "#AAAAAA", borderStyle: "dashed" }} />
        </View>
 
        {/* Copy 2 — bottom half */}
        <View style={{ flex: 1 }}>
          <InvoiceContentA5 invoice={invoice} />
        </View>
 
      </Page>
    </Document>
  );
}