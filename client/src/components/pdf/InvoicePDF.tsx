import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const convertLessThanThousand = (
  amount: number
) => {
  let words = "";

  if (amount >= 100) {
    words +=
      `${ones[Math.floor(amount / 100)]} Hundred`;

    amount %= 100;

    if (amount) {
      words += " ";
    }
  }

  if (amount >= 20) {
    words +=
      tens[Math.floor(amount / 10)];

    amount %= 10;

    if (amount) {
      words +=
        ` ${ones[amount]}`;
    }
  } else if (amount > 0) {
    words +=
      ones[amount];
  }

  return words;
};

const convertNumberToWords = (
  amount: number
) => {
  if (amount === 0) {
    return "Zero";
  }

  const parts = [
    {
      value: 10000000,
      label: "Crore",
    },
    {
      value: 100000,
      label: "Lakh",
    },
    {
      value: 1000,
      label: "Thousand",
    },
    {
      value: 1,
      label: "",
    },
  ];

  let remaining = amount;
  const words: string[] = [];

  for (const part of parts) {
    const count =
      Math.floor(
        remaining / part.value
      );

    if (count) {
      words.push(
        `${convertLessThanThousand(count)} ${part.label}`.trim()
      );

      remaining %= part.value;
    }
  }

  return words.join(" ");
};

const convertAmountToWords = (
  amount: number
) => {
  const rupees =
    Math.floor(amount);

  const paise =
    Math.round(
      (amount - rupees) * 100
    );

  const rupeeWords =
    `${convertNumberToWords(rupees)} Rupees`;

  if (!paise) {
    return `${rupeeWords} Only`;
  }

  return `${rupeeWords} and ${convertNumberToWords(paise)} Paise Only`;
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    border: 1,
    borderColor: "#D1D5DB",
  },

  headerContainer: {
    border: 1,
    borderColor: "#000",
    padding: 10,
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  logo: {
    width: 80,
    height: 60,
    objectFit: "contain",
    marginRight: 12,
  },

  companyBlock: {
    flexDirection: "row",
    flex: 1,
  },

  companyInfo: {
    flex: 1,
  },

  companyName: {
    fontSize: 24,
    fontWeight: "bold",
  },

  invoiceInfo: {
    width: 220,
  },

  section: {
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },

  invoiceInfoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },

  invoiceInfoLabel: {
    width: 90,
    fontWeight: "bold",
  },

  table: {
    width: "100%",
    marginTop: 10,
    border: 1,
    borderColor: "#ddd",
  },

  row: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#ddd",
    paddingVertical: 6,
  },

  cell: {
    flex: 1,
  },

  productCell: {
    flex: 2,
  },

  smallCell: {
    flex: 0.8,
  },

  tableHeader: {
    backgroundColor: "#E5E7EB",
    fontWeight: "bold",
  },

  summary: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: 220,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  grandTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  amountWords: {
    marginTop: 16,
    padding: 10,
    border: 1,
    borderColor: "#E5E7EB",
  },

  amountWordsTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  terms: {
    marginTop: 40,
  },

  termsTitle: {
    fontSize: 14,
    marginBottom: 10,
  },

  signature: {
    marginTop: 60,
    alignItems: "flex-end",
    borderTop: 1,
    borderColor: "#000",
    paddingTop: 15,
  },

  signatureImage: {
    width: 140,
    height: 70,
    objectFit: "contain",
    marginVertical: 8,
  },

  footer: {
    position: "absolute",
    bottom: 18,
    left: 30,
    right: 30,
    borderTop: 1,
    borderColor: "#D1D5DB",
    paddingTop: 8,
    textAlign: "center",
    color: "#4B5563",
    fontSize: 10,
  },
});

interface Props {
  invoice: any;
}

export default function InvoicePDF({
  invoice,
}: Props) {

  const subtotal =
    invoice.items.reduce(
      (
        sum: number,
        item: any
      ) =>
        sum +
        item.quantity *
        item.price,
      0
    );

  const gstTotal =
    invoice.items.reduce(
      (sum: number, item: any) =>
        sum +
        (
          item.quantity *
          item.price *
          (item.gstPercent || 0)
        ) / 100,
      0
    );

  const grandTotal =
    subtotal + gstTotal;

  const amountInWords =
    convertAmountToWords(
      grandTotal
    );

  const tenant =
    typeof invoice.tenantId === "object"
      ? invoice.tenantId
      : {};

  return (
    <Document>

      <Page
        size="A4"
        style={styles.page}
      >

        <View style={styles.headerContainer}>

          <View style={styles.header}>

            <View style={styles.companyBlock}>

              {tenant?.logo && (
                <Image
                  src={tenant.logo}
                  style={styles.logo}
                />
              )}

              <View style={styles.companyInfo}>

                <Text
                  style={styles.companyName}
                >
                  {
                    tenant?.companyName
                  }
                </Text>

                <Text>
                  GSTIN:
                  {" "}
                  {
                    tenant?.gstNumber
                  }
                </Text>

                <Text>
                  Phone:
                  {" "}
                  {
                    tenant?.phone
                  }
                </Text>

                {tenant?.email && (
                  <Text>
                    Email:
                    {" "}
                    {
                      tenant.email
                    }
                  </Text>
                )}

                {tenant?.address && (
                  <Text>
                    Address:
                    {" "}
                    {
                      tenant.address
                    }
                  </Text>
                )}

              </View>

            </View>

            <View style={styles.invoiceInfo}>

              <Text
                style={styles.title}
              >
                TAX INVOICE
              </Text>

              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>
                  Invoice No
                </Text>

                <Text>
                  :
                  {" "}
                  {
                    invoice.invoiceNumber
                  }
                </Text>
              </View>

              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>
                  Date
                </Text>

                <Text>
                  :
                  {" "}
                  {
                    new Date(
                      invoice.createdAt
                    )
                      .toLocaleDateString(
                        "en-IN"
                      )
                  }
                </Text>
              </View>

              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>
                  Status
                </Text>

                <Text>
                  :
                  {" "}
                  {
                    invoice.paymentStatus ||
                    "Pending"
                  }
                </Text>
              </View>

              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>
                  Amount Due
                </Text>

                <Text>
                  :
                  {" "}
                  Rs.
                  {" "}
                  {
                    grandTotal.toFixed(2)
                  }
                </Text>
              </View>

            </View>

          </View>

        </View>

        <View
          style={styles.section}
        >

          <Text>
            Bill To:
          </Text>

          <Text>
            {
              invoice.customerId
                ?.name
            }
          </Text>

          <Text>
            GSTIN:
            {" "}
            {
              invoice.customerId
                ?.gstNumber
            }
          </Text>

          <Text>
            Phone:
            {" "}
            {
              invoice.customerId
                ?.phone
            }
          </Text>

          <Text>
            {
              invoice.customerId
                ?.address
            }
          </Text>

        </View>

        <View style={styles.table}>

          <View
            style={[
              styles.row,
              styles.tableHeader,
            ]}
          >

            <Text
              style={styles.productCell}
            >
              Product
            </Text>

            <Text
              style={styles.smallCell}
            >
              Qty
            </Text>

            <Text
              style={styles.cell}
            >
              Rate
            </Text>

            <Text
              style={styles.cell}
            >
              Taxable
            </Text>

            <Text
              style={styles.cell}
            >
              GST
            </Text>

            <Text
              style={styles.cell}
            >
              Amount
            </Text>

          </View>

          {invoice.items.map(
            (
              item: any,
              index: number
            ) => (

              <View
                key={index}
                style={styles.row}
              >

                <Text
                  style={styles.productCell}
                >
                  {
                    item.productId
                      ?.name
                  }
                </Text>

                <Text
                  style={styles.smallCell}
                >
                  {
                    item.quantity
                  }
                </Text>

                <Text
                  style={styles.cell}
                >
                  Rs.
                  {item.price}
                </Text>

                <Text
                  style={styles.cell}
                >
                  Rs.
                  {
                    (
                      item.quantity *
                      item.price
                    ).toFixed(2)
                  }
                </Text>

                <Text
                  style={styles.cell}
                >
                  Rs.
                  {
                    (
                      item.quantity *
                      item.price *
                      (item.gstPercent || 0)
                    / 100
                    ).toFixed(2)
                  }
                </Text>

                <Text
                  style={styles.cell}
                >
                  Rs.
                  {
                    (
                      (item.quantity * item.price) +
                      (
                        item.quantity *
                        item.price *
                        (item.gstPercent || 0)
                      ) / 100
                    ).toFixed(2)
                  }
                </Text>

              </View>

            )
          )}

        </View>

        <View
          style={styles.summary}
        >

          <View
            style={
              styles.summaryRow
            }
          >
            <Text>
              Subtotal
            </Text>

            <Text>
              Rs.
              {
                subtotal.toFixed(2)
              }
            </Text>
          </View>

          <View
            style={
              styles.summaryRow
            }
          >
            <Text>
              GST
            </Text>

            <Text>
              Rs.
              {
                gstTotal.toFixed(2)
              }
            </Text>
          </View>

          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={
                styles.grandTotal
              }
            >
              Grand Total
            </Text>

            <Text
              style={
                styles.grandTotal
              }
            >
              Rs.
              {" "}
              {
                grandTotal.toFixed(2)
              }
            </Text>
          </View>

        </View>

        <View style={styles.amountWords}>

          <Text style={styles.amountWordsTitle}>
            Amount in Words:
          </Text>

          <Text>
            {amountInWords}
          </Text>

        </View>

        <View
          style={styles.terms}
        >

          <Text
            style={styles.termsTitle}
          >
            Terms & Conditions
          </Text>

          <Text>
            1. Goods once sold will not be taken back.
          </Text>

          <Text>
            2. Subject to Gurugram jurisdiction.
          </Text>

          <Text>
            3. Payment due within agreed credit period.
          </Text>

          <Text>
            4. Interest may apply on overdue balances.
          </Text>

        </View>

        <View
          style={styles.signature}
        >

          <Text>
            For
            {" "}
            {
              tenant?.companyName
            }
          </Text>

          {tenant?.signature && (
            <Image
              src={tenant.signature}
              style={styles.signatureImage}
            />
          )}

          <Text>
            Authorized Signatory
          </Text>

        </View>

        <View style={styles.footer}>

          <Text>
            Generated by RateFlow ERP
          </Text>

          <Text>
            www.rateflow.in
          </Text>

        </View>

      </Page>

    </Document>
  );
}
