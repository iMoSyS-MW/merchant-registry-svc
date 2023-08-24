import { isAxiosError } from 'axios'

import type { FormReponse } from '@/types/form'
import type { MerchantDetails } from '@/types/merchantDetails'
import instance from '@/lib/axiosInstance'
import type {
  BusinessInfoForm,
  ContactPersonForm,
  LocationInfoForm,
  OwnerInfoForm,
} from '@/lib/validations/registry'
import type { MerchantsFilterForm } from '@/lib/validations/merchantsFilter'
import type { AllMerchantsFilterForm } from '@/lib/validations/allMerchantsFilter'

export async function login(email: string, password: string) {
  try {
    const response = await instance.post<{ token: string }>('/users/login', {
      email,
      password,
    })

    if (response.data.token) {
      alert('Login Successful')
      return response.data.token
    }
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your credentials and try again.'
      )
    }
  }
}

export async function getDraftCount() {
  try {
    const response = await instance.get<{ data: number }>('/merchants/draft-counts')

    return response.data.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message)
    }
  }
}

export async function getDraftData(merchantId: string) {
  try {
    const response = await instance.get<{ data: MerchantDetails }>(
      `/merchants/${merchantId}`
    )

    return response.data.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message)
    }
  }
}

export async function createBusinessInfo(values: BusinessInfoForm) {
  const formData = new FormData()

  // Loop over the form values and append each one to the form data.
  Object.entries(values).forEach(([key, value]) => {
    if (value instanceof File || typeof value === 'string') {
      formData.append(key, value)
    }
  })

  try {
    const response = await instance.post<FormReponse>('/merchants/draft', formData)
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function updateBusinessInfo(values: BusinessInfoForm, merchantId: string) {
  const formData = new FormData()

  // Loop over the form values and append each one to the form data.
  Object.entries(values).forEach(([key, value]) => {
    if (value instanceof File || typeof value === 'string') {
      formData.append(key, value)
    }
  })

  try {
    const response = await instance.put<FormReponse>(
      `/merchants/${merchantId}/draft`,
      formData
    )
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function createLocationInfo(values: LocationInfoForm, merchantId: string) {
  try {
    const response = await instance.post<FormReponse>(
      `/merchants/${merchantId}/locations`,
      values
    )

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function updateLocationInfo(
  values: LocationInfoForm,
  merchantId: string,
  locationId: number
) {
  try {
    const response = await instance.put<FormReponse>(
      `/merchants/${merchantId}/locations/${locationId}`,
      values
    )

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function createOwnerInfo(values: OwnerInfoForm, merchantId: string) {
  try {
    const response = await instance.post<FormReponse>(
      `/merchants/${merchantId}/business-owners`,
      values
    )

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function updateOwnerInfo(
  values: OwnerInfoForm,
  merchantId: string,
  ownerId: number
) {
  try {
    const response = await instance.put<FormReponse>(
      `/merchants/${merchantId}/business-owners/${ownerId}`,
      values
    )

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function createContactPersonInfo(
  values: ContactPersonForm,
  merchantId: string
) {
  try {
    const response = await instance.post<FormReponse>(
      `/merchants/${merchantId}/contact-persons`,
      values
    )

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function updateContactPersonInfo(
  values: ContactPersonForm,
  merchantId: string,
  contactPersonId: number
) {
  try {
    const response = await instance.put<FormReponse>(
      `/merchants/${merchantId}/contact-persons/${contactPersonId}`,
      values
    )

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          'Something went wrong! Please check your data and try again.'
      )
    }
  }
}

export async function changeStatusToReview(merchantId: string) {
  try {
    return await instance.put(`/merchants/${merchantId}/ready-to-review`)
  } catch (error) {
    if (isAxiosError(error)) {
      alert(
        error.response?.data?.message || 'Something went wrong! Please try again later.'
      )
    }
  }
}

export async function getMerchants(params: AllMerchantsFilterForm | MerchantsFilterForm) {
  const response = await instance.get<{ data: MerchantDetails[] }>('/merchants', {
    params,
  })

  return response.data.data
}

export async function getMerchant(merchantId: number) {
  try {
    const response = await instance.get<{ data: MerchantDetails }>(
      `/merchants/${merchantId}`
    )

    return response.data.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message)
    }
  }
}

export async function approveMerchants(selectedMerchantIds: number[]) {
  try {
    await instance.put('/merchants/bulk-approve', {
      ids: selectedMerchantIds,
    })
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message)
    }
  }
}

export async function rejectMerchants(selectedMerchantIds: number[], reason: string) {
  try {
    await instance.put('/merchants/bulk-reject', {
      ids: selectedMerchantIds,
      reason,
    })
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message)
    }
  }
}

export async function revertMerchants(selectedMerchantIds: number[], reason: string) {
  try {
    await instance.put('/merchants/bulk-revert', {
      ids: selectedMerchantIds,
      reason,
    })
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message)
    }
  }
}

export async function exportMerchants(
  params: AllMerchantsFilterForm | MerchantsFilterForm
) {
  try {
    const response = await instance.get<Blob>(`/merchants/export-with-filter`, {
      params,
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message)
    }
  }
}
